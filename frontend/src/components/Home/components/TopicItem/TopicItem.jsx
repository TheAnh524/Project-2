import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Topic } from '@/types/topic.type'
import { FC } from 'react'
import { Link } from 'react-router'

interface TopicItemProp {
  topic: Topic
}

const TopicItem: FC<TopicItemProp> = ({ topic }) => {
  return (
    <Card className="shadow-lg">
      <Link to={'/topics/' + topic._id} className="group">
        <CardContent>
          <img
            src={topic.image}
            alt={topic.name}
            className="w-full h-60 object-cover"
          />
        </CardContent>
        <CardHeader className="flex flex-row items-center gap-4">
          <div>
            <CardTitle className="text-lg group-hover:text-blue-400">
              {topic.name}
            </CardTitle>
          </div>
        </CardHeader>
      </Link>
    </Card>
  )
}

export default TopicItem
