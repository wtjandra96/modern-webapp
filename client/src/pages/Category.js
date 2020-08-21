import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

import { postOperations } from "../state/redux/post";
import Posts from "../layout/Posts";

const Category = props => {
  // dispatch
  const { getPosts } = props;
  // redux state
  const { categoriesList, isGuest } = props;
  // react-router-dom
  const { categoryName } = useParams();

  const [category, setCategory] = useState(null);
  const [redirect, setRedirect] = useState(false);

  // get category info from categoriesList
  useEffect(() => {
    if (categoriesList && categoriesList.length > 0) {
      for (let i = 0; i < categoriesList.length; i++) {
        let category = categoriesList[i];
        if (category.name === categoryName) {
          setCategory(category);
          return;
        }
      }
      // not found
      setRedirect(true);
    }

  }, [categoryName, categoriesList]);

  // get posts of this category
  useEffect(() => {
    if (category) {
      getPosts(category.id, isGuest);
    }
  }, [getPosts, category, isGuest]);

  if (redirect) {
    return <Redirect to="/posts" />;
  }

  return (
    <Posts
      title={categoryName}
      category={category}
    />
  );
};

const { func, bool, arrayOf, string, shape } = PropTypes;
Category.propTypes = {
  // dispatch
  getPosts: func.isRequired,
  // redux state
  categoriesList: arrayOf(shape({
    name: string.isRequired,
    color: string.isRequired,
    id: string.isRequired
  })).isRequired,
  isGuest: bool.isRequired
};

const mapStateToProps = state => ({
  categoriesList: state.category.categoriesList,
  isGuest: state.user.isGuest
});

const mapDispatchToProps = {
  getPosts: postOperations.getPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);