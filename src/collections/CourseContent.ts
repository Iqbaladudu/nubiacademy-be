import { CollectionConfig, PayloadRequest } from 'payload'
import { v4 as uuidv4 } from 'uuid'

async function isOrderByUser({
  req,
  siblingData,
}: {
  data?: Partial<any> | undefined
  doc?: any
  id?: string | number | undefined
  req: PayloadRequest
  siblingData?: Partial<any> | undefined
}) {
  let isBelongByUser
  if (siblingData) {
    const module_id = await siblingData?.module
    const getModuleObj = await req.payload.findByID({
      collection: 'module',
      depth: 0,
      id: module_id,
    })

    const course_id = getModuleObj.course

    const getUserCourse = await req.payload.find({
      collection: 'orders',
      depth: 0,
      where: {
        and: [
          {
            user: {
              equals: req.user?.id,
            },
          },
          {
            course_item: {
              equals: course_id,
            },
          },
        ],
      },
    })

    isBelongByUser = getUserCourse.totalDocs > 0
  }

  return Boolean(isBelongByUser || req.user?.collection === 'admin')
}

const CourseContent: CollectionConfig = {
  slug: 'course-content',
  labels: {
    plural: 'Materi Kursus',
    singular: 'Materi Kursus',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (user?.collection === 'admin') {
        return true
      } else return false
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'admin') {
        return true
      } else return false
    },
  },
  fields: [
    {
      name: 'module',
      label: 'Modul',
      type: 'relationship',
      relationTo: 'module',
      hasMany: false,
      // admin: {
      //   components: {
      //    Field: "/src/components#ModuleLabelWithCourseName",
      //   }
      // }
    },
    {
      name: 'title',
      label: 'Judul',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Materi',
      type: 'richText',
      // access: {
      //   read: isOrderByUser,
      //   update: isOrderByUser,
      //   create: isOrderByUser,
      // },
    },
    {
      name: 'videoUrl',
      label: 'URL video',
      type: 'text',
    },
    {
      name: 'attachment',
      label: 'Lampiran',
      type: 'upload',
      relationTo: 'upload-document',
    },
    {
      name: 'enable_preview',
      type: 'checkbox',
      label: 'Hidupkan preview',
      defaultValue: false,
    },
    {
      name: 'order_num',
      label: 'Urutan',
      type: 'number',
      required: true,
      unique: false,
    },
  ],

  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (req.user?.collection === 'users') {
          const getUserCourse = await req.payload.find({
            collection: 'orders',
            depth: 0,
            where: {
              and: [
                {
                  user: {
                    equals: req.user?.id,
                  },
                },
                {
                  course_item: {
                    equals: doc.module.course.id,
                  },
                },
              ],
            },
          })

          const getContents = await req.payload.find({
            collection: 'course-content',
            depth: 0,
            where: {
              module: {
                equals: doc.module,
              },
            },
          })

          const findContentPosition = getContents.docs.findIndex((arr) => arr.id === doc.id)
          const findModulePosition = doc.module.course.modules.findIndex(
            (arr) => arr.id === doc.module.id,
          )

          if (
            getContents.docs.length > 0 &&
            doc.module.course.modules.length > 0 &&
            findContentPosition > -1 &&
            findModulePosition > -1
          ) {
            function getCurrentLesson() {
              return { lesson_id: doc.id, title: doc.title }
            }

            function getNextLesson(
              findContentPosition: number,
              getContent: typeof getContents,
              findModulePosition: number,
              doc: { module: { course: { modules: string | any[] } } },
            ) {
              if (findContentPosition < getContent.docs.length - 1) {
                const nextDoc = getContent.docs[findContentPosition + 1]
                return { lesson_id: nextDoc.id, title: nextDoc.title }
              }

              if (findModulePosition < doc.module.course.modules.length - 1) {
                const nextModule = doc.module.course.modules[findModulePosition + 1]
                if (nextModule.contents && nextModule.contents.length > 0) {
                  return {
                    lesson_id: nextModule.contents[0].id,
                    title: nextModule.contents[0].title,
                    next_module: nextModule.id,
                  }
                }
              }

              return { lesson_id: '', title: '' }
            }

            function getPreviousLesson(
              findContentPosition: number,
              getContent: typeof getContents,
              findModulePosition: number,
              doc: { module: { course: { modules: any[] } } },
            ) {
              if (findContentPosition > 0) {
                const prevDoc = getContent.docs[findContentPosition - 1]
                return { lesson_id: prevDoc.id, title: prevDoc.title }
              }

              if (findModulePosition > 0) {
                const previousModule = doc.module.course.modules[findModulePosition - 1]
                if (previousModule.contents && previousModule.contents.length > 0) {
                  const previousContentModule = previousModule.contents.length - 1
                  return {
                    lesson_id: previousModule.contents[previousContentModule].id,
                    title: previousModule.contents[previousContentModule].title,
                    prev_module: previousModule.id,
                  }
                }
              }

              return { lesson_id: '', title: '' }
            }

            doc.lesson_info = {
              next: getNextLesson(findContentPosition, getContents, findModulePosition, doc),
              previous: getPreviousLesson(
                findContentPosition,
                getContents,
                findModulePosition,
                doc,
              ),
              current: getCurrentLesson(),
            }
          }

          if (getUserCourse.totalDocs > 0) {
            const progress = await req.payload.find({
              collection: 'course-progresses',
              depth: 0,
              where: {
                course: {
                  equals: doc.module.course.id,
                },
              },
            })

            if (progress.docs.length > 0) {
              const progress_data = progress.docs[0]
              const is_content_exist = progress_data.completedContent?.some((content) => {
                return content.content === doc.id
              })

              if (!is_content_exist) {
                const update = await req.payload.update({
                  collection: 'course-progresses',
                  id: progress_data.id,
                  data: {
                    ...progress_data,
                    completedContent: [
                      ...progress_data.completedContent!,
                      {
                        content: doc.id,
                        completedAt: new Date().toString(),
                      },
                    ],
                  },
                })

                doc.status = 'DONE'
              } else {
                doc.status = 'DONE'
              }
            } else {
              const create = await req.payload.create({
                collection: 'course-progresses',
                data: {
                  user: req.user.id,
                  course: doc.module.course.id,
                  completedContent: [
                    {
                      content: doc.id,
                      completedAt: new Date().toString(),
                    },
                  ],
                  lastAccessedAt: new Date().toString(),
                },
              })

              doc.status = 'DONE'
            }

            return {
              ...doc,
            }
          } else {
            return {
              ...doc,
              content: doc.enable_preview ? doc.content : '',
            }
          }
        } else if (req.user?.collection === 'admin') {
          return doc
        } else {
          return {
            ...doc,
            content: doc.enable_preview ? doc.content : '',
          }
        }
      },
    ],
  },
}

export default CourseContent
