import React, { useState } from 'react'
import { connect } from "react-redux"

import styled from "styled-components"

import Space from './basic/Space'
import Button from './basic/Button'

import ColorPicker from "./ColorPicker";

import { categoryOperations } from '../state/redux/category'
import Text from './basic/Text'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Icon from './basic/Icon'

const Wrapper = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
`

const FormControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Input = styled.input`
  flex-grow: 1;
  border-radius: 4px;
  border: 1px solid #c0c0c0;
  font-size: 16px;
  min-height: 36px;
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CategoryForm = props => {
  // dispatch
  const { createCategory, editCategory } = props;
  // redux state
  const { isGuest } = props;
  // passed function
  const { closeForm } = props;
  // passed props
  const { id, categoryColor, categoryName, isEdit } = props;

  const [color, setColor] = useState(categoryColor || "");
  const [newCategoryName, setNewCategoryName] = useState(categoryName || "");

  return (
    <Wrapper>
      {isEdit &&
        <>
          <FormHeader>
            <Text fontWeight="500">Editing {categoryName}</Text>
            <Icon onClick={closeForm}>
              <FontAwesomeIcon icon={faTimes} />
            </Icon>
          </FormHeader>
          <Space height="12" />
        </>
      }
      <Input
        type="text"
        onChange={e => setNewCategoryName(e.target.value)}
        placeholder="Category Name"
        value={newCategoryName}
      />
      <Space height="12" />
      <FormControl>
        <ColorPicker color={color} setColor={setColor} />
        <Button onClick={() => {
          if (isEdit) {
            editCategory(id, newCategoryName, color, isGuest);
            closeForm();
          } else {
            createCategory(newCategoryName, color, isGuest);
          }
          setColor(categoryColor || "");
          setNewCategoryName(categoryName || "");
        }}>
          {isEdit ? "Edit" : "Create"}
        </Button>
      </FormControl>
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  isGuest: state.user.isGuest
})

const mapDispatchToProps = {
  createCategory: categoryOperations.createCategory,
  editCategory: categoryOperations.editCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm)
