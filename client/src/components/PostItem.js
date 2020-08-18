import React, { useState } from 'react'
import { connect } from "react-redux";

import styled from "styled-components"

import { formatDistanceStrict } from "date-fns"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import DividerH from './basic/DividerH';
import Dropdown from './basic/Dropdown';
import DropdownItem from './basic/DropdownItem';
import Icon from './basic/Icon';
import Space from './basic/Space';
import Text from "./basic/Text";

import PostForm from "./PostForm";

import defaultThumbnail from "../img/default-thumbnail.png"

import { postOperations } from '../state/redux/post';

const Wrapper = styled.div`
	cursor: default;
	${({ showDropdown }) => !showDropdown && "cursor: pointer;"}
	${({ showDropdown }) => showDropdown && "pointer-events: none;"}
	padding: 12px; 
	overflow: hidden;
	flex-grow: 0;
	background-color: white;
	&:hover {
		border: 1px solid #c0c0c0;
		padding: 11px;
	}
`

const FlexWrapper = styled.div`
	display: flex;
`

const ControlWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Thumbnail = styled.div`
	width: 64px;
	height: 64px;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: 4px;
`

const ChevronContainer = styled.div`
	margin-left: auto;
	padding: 0;
	padding-left: 12px;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	overflow-wrap: break-word;
`;

const PostTitle = styled.div`
	overflow-wrap: break-word;
`

const PostItem = props => {
	// dispatch
	const { deletePost, bookmarkPost } = props;
	// redux state
	const { isGuest } = props;
	// passed props
	const { categoryName, post } = props;

	const [showDropdown, setShowDropdown] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	return (
		<Wrapper
			showDropdown={showDropdown}
			onClick={() => {
				if (showDropdown || isEdit) return;
				let link = post.url;
				if (!link.match(/^https?:\/\//i)) {
					link = 'https://' + link;
				}
				window.open(link, "_blank");
			}}
		>
			{isEdit ? (
				<PostForm
					closeForm={() => setIsEdit(false)}
					post={post}
					postTitle={post.title}
					postUrl={post.url}
					isEdit={true}
				/>
			) : (
					<>
						<FlexWrapper>
							<Thumbnail>
								<img src={post.imgSrc ? post.imgSrc : defaultThumbnail} alt="website" />
							</Thumbnail>
							<Space width="12" />
							<TextContainer>
								<PostTitle>
									<Text>{post.title}</Text>
								</PostTitle>
								<Space height="4" />
								<Text fontSize="12" color="gray">{post.source}</Text>
							</TextContainer>
							<ChevronContainer>
								<Icon
									onClick={e => {
										e.stopPropagation();
										if (!showDropdown) {
											setShowDropdown(true);
										}
									}}
									touchRadius="8"
								>
									<FontAwesomeIcon icon={faChevronDown} />
								</Icon>
								<Dropdown show={showDropdown} topOffset="24" onBlur={() => setShowDropdown(false)}>
									<DropdownItem
										onClick={() => {
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
										deletePost(post.id, isGuest);
									}}>
										<Text color="red" fontWeight="500">
											<Icon button={false}><FontAwesomeIcon icon={faTrashAlt} /></Icon>
											<Space width="12" />
											Delete
										</Text>
									</DropdownItem>
								</Dropdown>
							</ChevronContainer>
						</FlexWrapper>
						<Space height="18" />
						<ControlWrapper>
							<Text fontSize="12" color="gray">
								{formatDistanceStrict(new Date(), new Date(post.originalDate))}{categoryName && " • " + categoryName}
							</Text>
							<Icon
								button={!showDropdown}
								onClick={e => {
									e.stopPropagation();
									bookmarkPost(post.id, !post.isBookmarked, post.category, isGuest);
								}}
								touchRadius="8">
								<FontAwesomeIcon icon={post.isBookmarked ? faBookmarkSolid : faBookmark} />
							</Icon>
						</ControlWrapper>
					</>
				)}
		</Wrapper>
	)
}

const mapStateToProps = state => ({
	isGuest: state.user.isGuest
})

const mapDispatchToProps = {
	deletePost: postOperations.deletePost,
	bookmarkPost: postOperations.bookmarkPost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostItem)
