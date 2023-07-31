import { useId, useCallback, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BackButton } from '~/components/BackButton'
import './index.css'
import { setCurrentList } from '~/store/list'
import { fetchTodos, updateTodo, deleteTodo } from '~/store/todo'

const EditTask = () => {
  const id = useId()

  const { listId, taskId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const todo = useSelector(state =>
    state.todo.todos?.find(todo => todo.id === taskId),
  )

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setDetail(todo.detail)
      setDone(todo.done)
    }
  }, [todo])

  useEffect(() => {
    void dispatch(setCurrentList(listId))
    void dispatch(fetchTodos())
  }, [listId])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      void dispatch(updateTodo({ id: taskId, title, detail, done }))
        .unwrap()
        .then(() => {
          navigate(`/lists/${listId}`)
        })
        .catch(err => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, taskId, listId, detail, done],
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteTodo({ id: taskId }))
      .unwrap()
      .then(() => {
        navigate(`/`)
      })
      .catch(err => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [taskId])

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-title`} className="edit_list__form_label">
            Title
          </label>
          <input
            id={`${id}-title`}
            className="app_input"
            placeholder="Buy some milk"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label
            htmlFor={`${id}-description`}
            className="edit_list__form_label"
          >
            Description
          </label>
          <textarea
            id={`${id}-description`}
            className="app_input"
            placeholder="Blah blah blah"
            value={detail}
            onChange={event => setDetail(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-done`} className="edit_list__form_label">
            Is Done
          </label>
          <div>
            <input
              id={`${id}-done`}
              type="checkbox"
              checked={done}
              onChange={event => setDone(event.target.checked)}
            />
          </div>
        </fieldset>
        <div className="edit_list__form_actions">
          <Link to="/" data-variant="secondary" className="app_button">
            Cancel
          </Link>
          <div className="edit_list__form_actions_spacer"></div>
          <button
            type="button"
            className="app_button edit_list__form_actions_delete"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Update
          </button>
        </div>
      </form>
    </main>
  )
}

export default EditTask
