import React, { Fragment, useState } from 'react'
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { matchPath } from "react-router";

import styled from "styled-components"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookmark, faThLarge, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faReact } from "@fortawesome/free-brands-svg-icons";

import DividerH from "./basic/DividerH";
import Icon from "./basic/Icon";
import List from "./basic/List";
import Modal from "./basic/Modal";
import ModalHeader from "./basic/ModalHeader"
import SideNav from "./basic/SideNav";
import SideNavItem from "./basic/SideNavItem";
import Space from "./basic/Space";
import Text from "./basic/Text";

import CategoryItem from "./CategoryItem";
import CategoryForm from './CategoryForm';

import { modalActions } from '../state/redux/modal';

const SideNavText = styled.div`
  display: none;
  @media (min-width: 860px) {
    width: 100%;
    display: flex;
  }
`

const SideNavigation = props => {
  // redux state
  const { categoriesList } = props;
  // react-router-dom
  const { history, location } = props;

  const dispatch = useDispatch();

  const [showCategories, setShowCategories] = useState(false);

  const isActivePath = path => matchPath(path, {
    path: location.pathname
  })

  const navigate = to => {
    history.push(to);
  }

  return (
    <>
      {showCategories && (
        <Modal closeModal={() => {
          setShowCategories(false);
          dispatch(modalActions.closeModal());
        }}>
          <ModalHeader>
            <Text fontWeight="500" fontSize="18">Categories</Text>
            <Icon onClick={() => {
              setShowCategories(false);
              dispatch(modalActions.closeModal());
            }}>
              <FontAwesomeIcon icon={faTimes} />
            </Icon>
          </ModalHeader>
          <DividerH />
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
            <Space height="6" />
          </List>
          <DividerH />
          <CategoryForm />
        </Modal>
      )}
      <SideNav>
        <SideNavItem cursor="default">
          <Icon button={false} fontSize="32" color="#A0A0A0">
            <FontAwesomeIcon icon={faReact} />
          </Icon>
        </SideNavItem>
        <SideNavItem onClick={() => navigate("/posts")}
          color={isActivePath("/posts") && "#A0A0A0"}
        >
          <Icon button={false} fontSize="24">
            <FontAwesomeIcon icon={faHome} />
          </Icon>
          <SideNavText>
            <Space width="20" />
            <Text
              fontSize="18"
              fontWeight="500"
              color={isActivePath("/posts") && "#A0A0A0"}
            >
              Home
            </Text>
          </SideNavText>
        </SideNavItem>
        <SideNavItem onClick={() => {
          setShowCategories(true);
          dispatch(modalActions.openModal());
        }}>
          <Icon button={false} fontSize="22">
            <FontAwesomeIcon icon={faThLarge} />
          </Icon>
          <SideNavText>
            <Space width="20" />
            <Text
              fontSize="18"
              fontWeight="500"
            >
              Categories
            </Text>
          </SideNavText>
        </SideNavItem>
        <SideNavItem onClick={() => navigate("/bookmarks")}
          color={isActivePath("/bookmarks") && "#A0A0A0"}
        >
          <Icon button={false} fontSize="20">
            <FontAwesomeIcon icon={faBookmark} />
          </Icon>
          <SideNavText>
            <Space width="20" />
            <Text
              fontSize="18"
              fontWeight="500"
              color={isActivePath("/bookmarks") && "#A0A0A0"}
            >
              Bookmarks
            </Text>
          </SideNavText>
        </SideNavItem>
      </SideNav>
    </>
  )
}

const mapStateToProps = state => ({
  categoriesList: state.category.categoriesList
})

export default connect(mapStateToProps)(withRouter(SideNavigation))
