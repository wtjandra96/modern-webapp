import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import DividerH from "./basic/DividerH";
import Icon from "./basic/Icon";
import Space from "./basic/Space";
import Text from "./basic/Text";
import { categoryOperations } from "../state/redux/category";
import Dropdown from "./basic/Dropdown";
import DropdownItem from "./basic/DropdownItem";
import CategoryForm from "./CategoryForm";

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 36px;
  cursor: pointer;
  &:hover {
    background-color: #FAFAFA;
  }
`;

const Color = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ color }) => color};
  border-radius: 4px;
  border: 1px solid hsla(0, 0%, 50%, 0.3);
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const EllipsisContainer = styled.div`
`;

const CategoryItem = props => {
  // dispatch
  const { deleteCategory } = props;
  // redux state
  const { isGuest } = props;
  // passed props
  const { id, color, name, onClick } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  let content;
  if (isEdit) {
    content = (
      <>
        <DividerH />
        <CategoryForm
          id={id}
          closeForm={() => setIsEdit(false)}
          categoryName={name}
          categoryColor={color}
          isEdit={true}
        />
        <DividerH />
      </>
    );
  } else {
    content = (
      <Wrapper
        showDropdown={showDropdown}
        onClick={() => {
          if (showDropdown || isEdit) return;
          onClick();
        }}
      >
        <Space width="12" />
        <Color color={color} />
        <Space width="12" />
        {name}
        <Filler />
        <EllipsisContainer>
          <Icon
            onClick={e => {
              e.stopPropagation();
              if (!showDropdown) {
                setShowDropdown(true);
              }
            }}
          >
            <FontAwesomeIcon icon={faEllipsisH} />
          </Icon>
          <Dropdown show={showDropdown} topOffset="24" onBlur={() => {
            setShowDropdown(false);
          }}>
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                setIsEdit(true);
                setShowDropdown(false);
              }}>
              <Text fontWeight="500">
                <Space width="2" />
                <Icon button={false}><FontAwesomeIcon icon={faEdit} /></Icon>
                <Space width="10" />
                Edit
              </Text>
            </DropdownItem>
            <DividerH />
            <DropdownItem onClick={e => {
              e.stopPropagation();
              deleteCategory(id, isGuest);
              setShowDropdown(false);
            }}>
              <Text color="red" fontWeight="500">
                <Icon button={false}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Icon>
                <Space width="12" />
                Delete
              </Text>
            </DropdownItem>
          </Dropdown>
        </EllipsisContainer>
        <Space width="12" />
      </Wrapper>
    );
  }
  return content;
};

CategoryItem.defaultProps = {
  id: null,
  onClick: () => {}
};

const { func, bool, string } = PropTypes;
CategoryItem.propTypes = {
  // dispatch
  deleteCategory: func.isRequired,
  // redux state
  isGuest: bool.isRequired,
  // passed props
  id: string,
  color: string.isRequired,
  name: string.isRequired,
  onClick: func
};

const mapStateToProps = state => ({
  isGuest: state.user.isGuest
});

const mapDispatchToProps = {
  deleteCategory: categoryOperations.deleteCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItem);
