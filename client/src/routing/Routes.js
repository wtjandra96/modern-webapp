import React from 'react'
import { Switch } from "react-router-dom"

import styled from "styled-components"

import PrivateRoute from "./PrivateRoute"

import BottomNavigation from "../components/BottomNavigation"
import SideNavigation from "../components/SideNavigation"

import Home from "../pages/Home"
import Category from '../pages/Category'
import Bookmarks from '../pages/Bookmarks'


const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
`

const Content = styled.div`
  flex-grow: 1;
  background-color: #EEEEEE;
  @media (min-width: 600px) {   
    border-left: 1px solid #c0c0c0; 
  }
  @media (min-width: 922px) {   
    border-right: 1px solid #c0c0c0; 
  }
`

const Routes = () => {
  return (
    <>
      <Wrapper>
        <SideNavigation />
        <Content>
          <Switch>
            <PrivateRoute exact path="/posts" component={Home} />
            <PrivateRoute exact path="/posts/:categoryName" component={Category} />
            <PrivateRoute exact path="/bookmarks" component={Bookmarks} />
          </Switch>
        </Content>
      </Wrapper>
      <BottomNavigation />
    </>
  )
}

export default Routes
