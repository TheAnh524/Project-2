import { createBrowserRouter } from 'react-router'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import ManagementLayout from '@/layouts/Management'
import ClientLayout from '@/layouts/Client'
import Home from '@/components/Home'
import TopicDetail from '@/components/TopicDetail'
import LessonDetail from '@/components/LessonDetail'
import TopicManagement from '@/components/managements/components/TopicManagement'
import CreateTopic from '@/components/managements/components/CreateTopic'
import UpdateTopic from '@/components/managements/components/UpdateTopic'
import LessonManagement from '@/components/managements/components/LessonManagement'
import UpdateLesson from '@/components/managements/components/UpdateLesson'
import AuthProviderLayout from '@/layouts/AuthProvider/AuthProvider'
import CreateLesson from '@/components/managements/components/CreateLesson'
import TopicLayout from '@/layouts/Topic'
import TeacherProviderLayout from '@/layouts/TeacherProvider'

const router = createBrowserRouter([
  {
    Component: AuthProviderLayout,
    children: [
      {
        Component: ClientLayout,
        children: [{ index: true, Component: Home }],
      },
      {
        path: 'topics/:topicId',
        Component: TopicLayout,
        children: [
          {
            index: true,
            Component: TopicDetail,
          },
          {
            path: 'learning/:lessonId',
            Component: LessonDetail,
          },
        ],
      },
      {
        Component: TeacherProviderLayout,
        children: [
          {
            Component: ManagementLayout,
            path: 'management',
            children: [
              {
                path: 'topics',
                children: [
                  {
                    index: true,
                    Component: TopicManagement,
                  },
                  {
                    path: 'create',
                    Component: CreateTopic,
                  },
                  {
                    path: ':topicId',
                    Component: UpdateTopic,
                  },
                ],
              },
              {
                path: 'lessons',
                children: [
                  {
                    index: true,
                    Component: LessonManagement,
                  },
                  {
                    path: 'create',
                    Component: CreateLesson,
                  },
                  {
                    path: ':lessonId',
                    Component: UpdateLesson,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    Component: Login,
  },
  {
    path: 'register',
    Component: Register,
  },
])
export default router
