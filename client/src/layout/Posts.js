import React, { Fragment, useState, useEffect } from 'react'
import { connect } from "react-redux"

import styled from "styled-components"

import AppBar from "../components/basic/AppBar"
import Avatar from "../components/Avatar"
import DividerH from "../components/basic/DividerH";
import Space from "../components/basic/Space";
import Text from "../components/basic/Text";

import PostForm from "../components/PostForm";
import PostItem from "../components/PostItem";

import { userOperations } from '../state/redux/user';

const PlaceholderPostItem = styled.div`
  background-color: #EEEEEE;
  width: 100%;
  height: 130px;
`

const Posts = (props) => {
  // dispatch
  const { logout } = props;
  // redux state
  const { postsList } = props;
  // passed props
  const { title, category } = props;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(postsList)
  }, [postsList])

  return (
    <>
      <AppBar>
        <Space width="12" />
        <Text fontWeight="500" fontSize="20">{title}</Text>
        <Avatar onClick={logout} />
      </AppBar>
      {category && (
        <>
          <PostForm categoryId={category.id} categoryName={category.name} />
          <DividerH />
        </>
      )}
      {posts && posts.map(post => (
        <Fragment key={post.id}>
          <PostItem
            categoryName={!category && post.category.name}
            post={post}
          />
          <DividerH />
        </Fragment>
      )
      )}
      <PlaceholderPostItem />
      <DividerH />
      <PlaceholderPostItem />
      <DividerH />
    </>
  )
}

const mapStateToProps = state => ({
  postsList: state.post.postsList,
  errors: state.post.errors
})

const mapDispatchToProps = {
  logout: userOperations.logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
