import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { postOperations } from "../state/redux/post";
import Posts from "../layout/Posts";

const Home = props => {
  // dispatch
  const { getPosts } = props;
  // redux state
  const { isGuest } = props;

  useEffect(() => {
    getPosts(null, isGuest);
  }, [getPosts, isGuest])

  return (
    <Posts
      title="Home"
    />
  )
}

const mapStateToProps = state => ({
  isGuest: state.user.isGuest
})

const mapDispatchToProps = {
  getPosts: postOperations.getPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);