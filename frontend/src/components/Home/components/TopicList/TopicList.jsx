import { getAllTopics, TopicKey } from '@/services/TopicServices'
import { Topic } from '@/types/topic.type'
import { useQuery } from '@tanstack/react-query'
import TopicItem from '../TopicItem'

const TopicList = () => {
  const { data: listTopicsRes } = useQuery({
    queryKey: [TopicKey],
    queryFn: getAllTopics,
  })

  const listTopics: Topic[] = listTopicsRes?.data || []
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {listTopics.map((topic) => (
        <TopicItem key={topic._id} topic={topic} />
      ))}
    </div>
  )
}

export default TopicList
