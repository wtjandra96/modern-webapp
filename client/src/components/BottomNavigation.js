import React, { Fragment, useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { matchPath } from "react-router";

import styled from "styled-components"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faBookmark, faPlus, faChevronUp } from "@fortawesome/free-solid-svg-icons";

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
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Wrapper = styled.div`
  position: sticky;
  background-color: white;
  bottom: 0;
  @media (min-width: 600px) {
    display: none;
  }
  z-index: 0;
`

const BottomSheetControl = styled.div`
  display: flex;
`

const NoCategory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

const Padding = styled.div`
  min-height: 56px;
`

const BottomNavigation = props => {
  // redux state
  const { categoriesList } = props;
  // react-router-dom
  const { history, location } = props;

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
        }}>
          <BottomSheetHeader>
            <Text fontWeight="500" fontSize="18">Categories</Text>
            <BottomSheetControl>
              <Icon touchRadius="10" onMouseDown={() => {
                if (!isAddingCategory)
                  setIsAddingCategory(true)
              }}>
                <FontAwesomeIcon icon={isAddingCategory ? faChevronUp : faPlus} />
              </Icon>
            </BottomSheetControl>
          </BottomSheetHeader>
          <DividerH />
          {
            isAddingCategory && (
              <>
                <CategoryForm isBottomSheet={true} closeForm={() => setIsAddingCategory(false)} />
                <DividerH />
              </>
            )
          }
          <List maxHeight="45vh">
            <Space height="6" />
            {categoriesList && categoriesList.map(category => {
              return (
                <Fragment key={category.id}>
                  <CategoryItem
                    onClick={() => {
                      navigate(`/posts/${category.name}`);
                      setShowCategories(false);
                    }}
                    color={category.color}
                    id={category.id}
                    name={category.name}
                  />
                </Fragment>
              )
            })}
            {(!categoriesList || categoriesList.length === 0) ?
              <NoCategory>
                <Text fontWeight="500">Create a category to get started!</Text>
              </NoCategory> :
              <Padding />
            }
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
        <DividerV />
        <BottomNavItem>
          <Icon
            onClick={() => window.open("https://github.com/wtjandra96/modern-webapp", "_blank")}
            fontSize="25"
            touchRadius="200"
          >
            <FontAwesomeIcon icon={faGithub} />
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
