import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { postOperations } from "../state/redux/post";
import Posts from "../layout/Posts";

const Bookmarks = props => {
  // dispatch
  const { getBookmarkedPosts } = props;
  // redux state
  const { isGuest } = props;

  useEffect(() => {
    getBookmarkedPosts(isGuest);
  }, [getBookmarkedPosts, isGuest])

  return (
    <Posts
      title="Bookmarks"
    />
  )
}

const mapStateToProps = state => ({
  isGuest: state.user.isGuest
})

const mapDispatchToProps = {
  getBookmarkedPosts: postOperations.getBookmarkedPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks);