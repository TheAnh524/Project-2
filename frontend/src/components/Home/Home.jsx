import TopicList from './components/TopicList'

const Home = () => {
  return (
    <>
      <title>Danh sách các khóa học</title>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mt-6">
        Danh sách các khóa học
      </h1>

      <TopicList />
    </>
  )
}

export default Home
