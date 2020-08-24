import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styled from "styled-components";

import Space from "./basic/Space";
import Button from "./basic/Button";

import ColorPicker from "./ColorPicker";

import { categoryOperations } from "../state/redux/category";
import Text from "./basic/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Icon from "./basic/Icon";

const Wrapper = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;

  &:focus {
    outline: 0;
  }
`;

const FormControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  flex-grow: 1;
  border-radius: 4px;
  border: 1px solid #c0c0c0;
  font-size: 16px;
  min-height: 36px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryForm = props => {
  // dispatch
  const { createCategory, editCategory } = props;
  // redux state
  const { isGuest, categoryErrors } = props;
  // passed function
  const { closeForm } = props;
  // passed props
  const { id, categoryColor, categoryName, isEdit, isBottomSheet } = props;

  const [color, setColor] = useState(categoryColor || "");
  const [newCategoryName, setNewCategoryName] = useState(categoryName || "");
  const [loading, setLoading] = useState(true);

  const ref = React.createRef();
  
  useEffect(() => {
    if (ref.current && isBottomSheet && loading) {
      ref.current.focus();
      setLoading(false);
    }
  }, [loading, ref, isBottomSheet]);

  let currentCategoryErrors;
  let categoryNameErrors;

  if (categoryErrors) {
    if (isEdit && id) {
      currentCategoryErrors = categoryErrors[id];
    } else {
      currentCategoryErrors = categoryErrors.base;
    }
    if (currentCategoryErrors) {
      categoryNameErrors = currentCategoryErrors.name;
    }
  }

  let timeoutId = null;

  const onBlur = () => {
    if (loading) return;
    if (isEdit || isBottomSheet) {
      timeoutId = setTimeout(() => closeForm && closeForm());
    }
  };

  const onFocus = () => {
    if (isEdit || isBottomSheet) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <Wrapper tabIndex="0" role="form" onBlur={onBlur} onFocus={onFocus}>
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
        ref={ref}
      />
      {categoryNameErrors && 
        <>
          <Space height="6" />
          {categoryNameErrors.map(errorMessage => (
            <Text key={errorMessage} color="red" fontSize="14">
              {errorMessage}
            </Text>
          ))}
        </>
      }
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
  );
};

CategoryForm.defaultProps = {
  closeForm: null,
  categoryErrors: {},
  isBottomSheet: false,
  isEdit: false,
  categoryColor: null,
  categoryName: null,
  id: null
};

const { string, bool, objectOf, shape, func, arrayOf } = PropTypes;
CategoryForm.propTypes = {
  // dispatch
  createCategory: func.isRequired,
  editCategory: func.isRequired,
  // redux state
  isGuest: bool.isRequired,
  categoryErrors: objectOf(
    objectOf(
      shape({
        name: arrayOf(string)
      })
    )
  ),
  // passed function
  closeForm: func,
  // passed props
  id: string,
  categoryColor: string,
  categoryName: string,
  isEdit: bool,
  isBottomSheet: bool
};

const mapStateToProps = state => ({
  isGuest: state.user.isGuest,
  categoryErrors: state.category.errors
});

const mapDispatchToProps = {
  createCategory: categoryOperations.createCategory,
  editCategory: categoryOperations.editCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);
