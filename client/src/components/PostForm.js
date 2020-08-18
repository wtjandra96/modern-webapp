import React, { useState } from 'react'
import { connect } from "react-redux";

import styled from "styled-components"

import Button from "./basic/Button";
import DividerH from './basic/DividerH';
import Space from './basic/Space';
import Text from "./basic/Text";

import { postOperations } from '../state/redux/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Icon from './basic/Icon';

const Wrapper = styled.div`
  padding: 12px;
  background-color: white;
`

const FormWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const ControlWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

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
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const PostForm = props => {
  // dispatch
  const { createPost, editPost } = props;
  // redux state
  const { isGuest } = props;
  // passed function
  const { closeForm } = props;
  // passed props
  const { categoryId, categoryName, isEdit, post } = props;

  const [title, setTitle] = useState((post && post.title) || "");
  const [url, setUrl] = useState((post && post.url) || "");

  return (
    <Wrapper>
      <FormWrapper>
        {isEdit &&
          <>
            <FormHeader>
              <Text fontWeight="500">Editing "{post && post.title}"</Text>
              <Icon onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </Icon>
            </FormHeader>
            <Space height="12" />
          </>
        }
        <Input type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Space height="12" />
        <TextArea
          placeholder="Url"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
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
            closeForm();
          } else {
            createPost(categoryId, categoryName, title, url, isGuest)
          }
          setTitle((post && post.title) || "");
          setUrl((post && post.url) || "");
        }}>
          <Text fontWeight="500">
            {isEdit ? "Edit" : "Post"}
          </Text>
        </Button>
      </ControlWrapper>
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  isGuest: state.user.isGuest
})

const mapDispatchToProps = {
  createPost: postOperations.createPost,
  editPost: postOperations.editPost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
