import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styled from "styled-components";

import AppBar from "../components/basic/AppBar";
import Avatar from "../components/Avatar";
import DividerH from "../components/basic/DividerH";
import Space from "../components/basic/Space";
import Text from "../components/basic/Text";

import PostForm from "../components/PostForm";
import PostItem from "../components/PostItem";

import { userOperations } from "../state/redux/user";
import Button from "../components/basic/Button";
import Modal from "../components//Modal";
import ModalHeader from "../components/basic/ModalHeader";
import { faTimes, faFeatherAlt } from "@fortawesome/free-solid-svg-icons";
import Icon from "../components/basic/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FloatingActionButton from "../components/basic/FloatingActionButton";

const PlaceholderPostItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 130px;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const Posts = (props) => {
  // dispatch
  const { logout } = props;
  // redux state
  const { postsList, currentlyProcessing, showingOverlay } = props;
  // passed props
  const { title, category } = props;

  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sortedPosts = postsList.sort((p1, p2) => {
      if (p1.updatedAt < p2.updatedAt) return 1;
      return -1;
    });
    setPosts(sortedPosts);
  }, [postsList]);

  useEffect(() => {
    if (currentlyProcessing) {
      setRequesting(true);
    }
    if (requesting && !currentlyProcessing) {
      setLoading(false);
    }
  }, [requesting, currentlyProcessing]);

  const closeForm = () => setIsCreatingPost(false);

  return (
    <>
      {category && 
        <FloatingActionButton 
          show={!isCreatingPost && !showingOverlay} 
          onClick={() => setIsCreatingPost(true)}
        >
          <FontAwesomeIcon icon={faFeatherAlt} />
        </FloatingActionButton>
      }
      <AppBar>
        <Space width="12" />
        <Text fontWeight="500" fontSize="20">{title}</Text>
        <Filler />
        {category && 
          <Button
            className="d-none d-md"
            onClick={() => setIsCreatingPost(true)}
          >
            New Post
          </Button>
        }
        <Space width="12" />
        <Avatar onClick={logout} />
      </AppBar>
      {isCreatingPost && (
        <Modal closeModal={() => setIsCreatingPost(false)}>
          <ModalHeader>
            <Text fontWeight="500" fontSize="18">New Post</Text>
            <Icon onClick={() => {
              setIsCreatingPost(false);
            }}>
              <FontAwesomeIcon icon={faTimes} />
            </Icon>
          </ModalHeader>
          <DividerH />
          <PostForm categoryId={category.id} categoryName={category.name} closeForm={closeForm} />
        </Modal>
      )}
      {!loading && posts && posts.map(post => (
        <Fragment key={post.id}>
          <PostItem
            categoryName={!category ? post.category.name : null}
            post={post}
          />
          <DividerH />
        </Fragment>
      ))}
      <PlaceholderPostItem>
        {(!loading && (!posts || posts.length === 0)) &&
          <Text fontWeight="500" fontSize="18">
            {title === "Bookmarks" ?
              "Bookmarked items will show up here!" :
              "There seems to be nothing here :("
            }
          </Text>
        }
      </PlaceholderPostItem>
      <DividerH />
    </>
  );
};

Posts.defaultProps = {
  category: null
};

<<<<<<< HEAD
const { func, arrayOf, bool, string, shape } = PropTypes;
=======
const { func, arrayOf, bool, string, shape, instanceOf } = PropTypes;
>>>>>>> master
Posts.propTypes = {
  // dispatch
  logout: func.isRequired,
  // redux state
  postsList: arrayOf(shape({
		title: string.isRequired,
		url: string.isRequired,
		id: string.isRequired,
		source: string.isRequired,
		isBookmarked: bool,
<<<<<<< HEAD
		updatedAt: string.isRequired
	})).isRequired,
  currentlyProcessing: bool.isRequired,
  showingOverlay: bool.isRequired,
=======
		updatedAt: instanceOf(Date).isRequired
	})).isRequired,
  currentlyProcessing: bool.isRequired,
>>>>>>> master
  // passed props
  title: string.isRequired,
  category: shape({
    name: string.isRequired,
    color: string.isRequired,
    id: string.isRequired
  })
};

const mapStateToProps = state => ({
  postsList: state.post.postsList,
  errors: state.post.errors,
<<<<<<< HEAD
  currentlyProcessing: state.post.currentlyProcessing,
  showingOverlay: state.modal.showingOverlay
=======
  currentlyProcessing: state.post.currentlyProcessing
>>>>>>> master
});

const mapDispatchToProps = {
  logout: userOperations.logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
