import React, { Fragment, useState } from 'react';
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { matchPath } from "react-router";

import styled from "styled-components"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faBookmark, faPlus } from "@fortawesome/free-solid-svg-icons";

import BottomNav from "./basic/BottomNav";
import BottomNavItem from "./basic/BottomNavItem";
import BottomSheet from "./basic/BottomSheet";
import BottomSheetHeader from "./basic/BottomSheetHeader";
import DividerH from './basic/DividerH';
import DividerV from "./basic/DividerV";
import Icon from "./basic/Icon";
import List from "./basic/List";
import Space from "./basic/Space"
import Text from "./basic/Text";

import CategoryItem from "./CategoryItem";
import CategoryForm from './CategoryForm';
import { modalActions } from '../state/redux/modal';

const Wrapper = styled.div`
  position: sticky;
  background-color: white;
  bottom: 0;
  @media (min-width: 600px) {
    display: none;
  }
`

const BottomSheetControl = styled.div`
  display: flex;
`

const BottomNavigation = props => {
  // redux state
  const { categoriesList } = props;
  // react-router-dom
  const { history, location } = props;

  const dispatch = useDispatch();

  const [showCategories, setShowCategories] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const isActivePath = path => matchPath(path, {
    path: location.pathname
  })

  const navigate = to => {
    history.push(to);
  }
  return (
    <Wrapper>
      {showCategories && (
        <BottomSheet closeSheet={() => {
          setShowCategories(false);
          dispatch(modalActions.closeModal());
        }}>
          <BottomSheetHeader>
            <Text fontWeight="500" fontSize="18">Categories</Text>
            <BottomSheetControl>
              <Icon touchRadius="10" onClick={() => {
                setIsAddingCategory(!isAddingCategory);
              }}>
                <FontAwesomeIcon icon={faPlus} />
              </Icon>
            </BottomSheetControl>
          </BottomSheetHeader>
          <DividerH />
          {
            isAddingCategory && (
              <>
                <CategoryForm />
                <DividerH />
              </>
            )
          }
          <List>
            <Space height="6" />
            {categoriesList && categoriesList.map(category => {
              return (
                <Fragment key={category.id}>
                  <CategoryItem
                    onClick={() => {
                      navigate(`/posts/${category.name}`);
                      setShowCategories(false);
                      dispatch(modalActions.closeModal());
                    }}
                    color={category.color}
                    id={category.id}
                    name={category.name}
                  />
                </Fragment>
              )
            })}
          </List>
          <Space height="6" />
        </BottomSheet>
      )}
      <BottomNav>
        <BottomNavItem>
          <Icon
            onClick={() => navigate("/posts")}
            fontSize="22"
            touchRadius="200"
            color={isActivePath("/posts") && "#A0A0A0"}
          >
            <FontAwesomeIcon icon={faHome} />
          </Icon>
        </BottomNavItem>
        <DividerV />
        <BottomNavItem>
          <Icon
            onClick={() => {
              setShowCategories(true);
              dispatch(modalActions.openModal());
            }}
            fontSize="20"
            touchRadius="200"
          >
            <FontAwesomeIcon icon={faThLarge} />
          </Icon>
        </BottomNavItem>
        <DividerV />
        <BottomNavItem>
          <Icon
            onClick={() => navigate("/bookmarks")}
            fontSize="18"
            touchRadius="200"
            color={isActivePath("/bookmarks") && "#A0A0A0"}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </Icon>
        </BottomNavItem>
      </BottomNav>
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  categoriesList: state.category.categoriesList
})

export default connect(mapStateToProps)(withRouter(BottomNavigation))
