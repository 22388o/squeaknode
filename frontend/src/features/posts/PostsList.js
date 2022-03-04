import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

import { useGetPostsQuery } from '../api/apiSlice'
import { useGetTimelineSqueaksQuery } from '../api/apiSlice'

let PostExcerpt = ({ squeak }) => {
  return (
    <article className="post-excerpt" key={squeak.getSqueakHash()}>
      <h3>{squeak.getAuthor().getProfileName()}</h3>
      <p className="post-content">{squeak.getContentStr().substring(0, 100)}</p>

      <Link to={`/posts/${squeak.getSqueakHash()}`} className="button muted-button">
        View Squeak
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const {
    data: squeaks = null,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetTimelineSqueaksQuery(5)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedSqueaks = squeaks.map((squeak) => (
      <PostExcerpt key={squeak.getSqueakHash()} squeak={squeak} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedSqueaks}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Squeaks</h2>
      {content}
    </section>
  )
}
