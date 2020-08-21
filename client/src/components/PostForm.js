import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";

import styled from "styled-components";

import Button from "./basic/Button";
import DividerH from "./basic/DividerH";
import Space from "./basic/Space";
import Text from "./basic/Text";

import { postOperations, postActions } from "../state/redux/post";

const Wrapper = styled.div`
  padding: 12px;
  background-color: white;
`;

const FormWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const ControlWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Input = styled.input`
	padding: 8px;
	font-size: 14px;
	border: 1px solid #c0c0c0;
	border-radius: 4px;
`;

const TextArea = styled.textarea`
	resize: none;
	padding: 8px;
	font-size: 14px;
	border: 1px solid #c0c0c0;
	border-radius: 4px;
	min-height: 56px;
`;

const PostForm = props => {
  // dispatch
  const { createPost, editPost } = props;
  // redux state
  const { isGuest, postErrors, currentlyProcessing } = props;
  // passed function
  const { closeForm } = props;
  // passed props
  const { categoryId, categoryName, isEdit, post } = props;

  const [title, setTitle] = useState((post && post.title) || "");
  const [url, setUrl] = useState((post && post.url) || "");
  const [requesting, setRequesting] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentlyProcessing) {
      setRequesting(true);
    }
    if (requesting && !currentlyProcessing) {
      // request is finished
      if (Object.keys(postErrors.length === 0) && closeForm) {
        closeForm();
      }
    }
  }, [currentlyProcessing, requesting, postErrors, closeForm]);

  useEffect(() => {
    return () => dispatch(postActions.clearErrors());
  }, [dispatch]);

  let currentPostErrors;
  let postTitleErrors;
  let postUrlErrors;

  if (postErrors) {
    if (isEdit && post) {
      currentPostErrors = postErrors[post.id];
    }
    else {
      currentPostErrors = postErrors.base;
    }
    if (currentPostErrors) {
      postTitleErrors = currentPostErrors.title;
      postUrlErrors = currentPostErrors.url;
    }
  }

  return (
    <Wrapper>
      <FormWrapper>
        <Input type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus={true}
        />
        {postTitleErrors && postTitleErrors.map(errorMessage => (
          <Text key={errorMessage} color="red" fontSize="14">
            {errorMessage}
          </Text>
        ))}
        <Space height="12" />
        <TextArea
          placeholder="Url"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        {postUrlErrors && postUrlErrors.map(errorMessage => (
          <Text key={errorMessage} color="red" fontSize="14">
            {errorMessage}
          </Text>
        ))}
      </FormWrapper>
      <Space height="12" />
      <DividerH />
      <Space height="12" />
      <ControlWrapper>
        {isEdit ? <div /> :
          <Text fontSize="14" color="gray">Posting in {categoryName}</Text>
        }
        <Button onClick={() => {
          if (isEdit) {
            editPost(post.id, title, url, post.category, isGuest);
          } else {
            createPost(categoryId, categoryName, title, url, isGuest);
          }
        }}>
          <Text fontWeight="500">
            {isEdit ? "Edit" : "Post"}
          </Text>
        </Button>
      </ControlWrapper>
    </Wrapper>
  );
};

PostForm.defaultProps = {
  categoryId: null,
  categoryName: null,
	post: {
		isBookmarked: false
	}
};

const { func, bool, objectOf, arrayOf, shape, string, instanceOf } = PropTypes;
PostForm.propTypes = {
  // dispatch
  createPost: func.isRequired,
  editPost: func.isRequired,
  // redux state
  isGuest: bool.isRequired,
  postErrors: objectOf(
    objectOf(
      shape({
        title: arrayOf(string),
        url: arrayOf(string)
      })
    )
  ),
  currentlyProcessing: bool.isRequired,
  // passed function
  closeForm: func.isRequired,
  // passed props
  categoryId: string,
  categoryName: string,
  isEdit: bool.isRequired,
	post: shape({
		title: string.isRequired,
		url: string.isRequired,
		id: string.isRequired,
		source: string.isRequired,
		isBookmarked: bool,
		updatedAt: instanceOf(Date).isRequired
	}).isRequired
};

const mapStateToProps = state => ({
  isGuest: state.user.isGuest,
  postErrors: state.post.errors,
  currentlyProcessing: state.post.currentlyProcessing
});

const mapDispatchToProps = {
  createPost: postOperations.createPost,
  editPost: postOperations.editPost
};

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
