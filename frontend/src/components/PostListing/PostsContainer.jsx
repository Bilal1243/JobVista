import React, { useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

import { useUserlistPostsMutation } from "../../redux/userSlices/userApiSlice";

function PostsContainer() {

  const [userlistPosts] = useUserlistPostsMutation()

  const fetchPosts = async()=>{
    try {
      const response = await userlistPosts()
      console.log(response)
    } catch (error) {
      console.log(error?.message || error?.data?.message)
    }
  }

  useEffect(()=>{
    fetchPosts()
  },[])

  return (
    <>
      <div className="bg-info mt-3">
        <h1>hey list post</h1>
      </div>
    </>
  )
}

export default PostsContainer
