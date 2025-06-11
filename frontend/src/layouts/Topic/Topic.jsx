import { Outlet } from 'react-router'
import Header from '../components/Header'
import { getTopicDetail, TopicKey } from '@/services/TopicServices'
import { Topic } from '@/types/topic.type'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

const TopicLayout = () => {
  const { topicId } = useParams()
  const { data: topicDetailRes } = useQuery({
    queryKey: [TopicKey, 'detail', topicId],
    queryFn: () => getTopicDetail(topicId ?? ''),
  })

  const topicDetail: Topic = topicDetailRes?.data
  return (
    <div className="flex flex-col height-screen">
      {topicDetail ? (
        <>
          <title>{topicDetail.name}</title>
          <Header title={topicDetail.name} />
        </>
      ) : (
        <Header />
      )}

      <section className="flex-1 w-full">
        <Outlet />
      </section>
    </div>
  )
}

export default TopicLayout
