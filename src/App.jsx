import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState([])
  const [notify, setNotify] = useState(null)
  const [isError, setIsError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setNotify(`${username} logged in successfully`)
      setIsError(false)
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setNotify(null)
      }, 5000)
    } catch (exception) {
      setNotify('Wrong credentials')
      setIsError(true)
      console.log("failed")
      setTimeout(() => {
        setNotify(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    console.log('adding new blog')
    try {
      const blog = {
        "title": title,
        "author": author,
        "url": url,
        "likes": 0
      }
      await blogService.create(blog)
      setNewBlog(blog)
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotify("Blog added")
      setIsError(false)
      setTimeout(() => {
        setNotify(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setNotify("Blog could not be added")
      setIsError(true)
      setTimeout(() => {
        setNotify(null)
        setIsError(false)
      }, 5000)
    }
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const blogForm = () => (
    <form onSubmit={handleNewBlog}>
      <div>
        title:
        <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          />
      </div>
      <div>
        url:
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          />
      </div>
      <button type="submit">save</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
  }
  return (
    <div>
      {notify !== null ? <Notification message={notify} error={isError}/> : <div></div>}
      <h2>blogs</h2>
      {user === null ? loginForm() : <div><p>{user.name} logged-in <button onClick={logOut}>logout</button></p>{blogForm()}</div>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App