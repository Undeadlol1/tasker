// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import store from 'browser/redux/store'
import Loading from 'browser/components/Loading'
import { t } from 'browser/containers/Translator'
import MoodTabs from 'browser/components/MoodTabs'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import ForumsList from 'browser/components/ForumsList'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import ThreadsList from 'browser/components/ThreadsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import CreateForumForm from 'browser/components/CreateForumForm'
import Wysiwyg from 'browser/components/Wysiwyg'

class IndexPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='IndexPage'
					loading={props.loading}
				>
					<WelcomeCard />
					{/* <MoodsInsert /> */}
					<b>{t('forums_list')}:</b>
					<ForumsList />
					{/* <b>Список тредов:</b>
					<ThreadsList /> */}
					<CreateForumForm />
					{/* <MoodTabs /> */}
				</PageWrapper>
    }
}

IndexPage.propTypes = {
	moods: PropTypes.object,
	totalPages: PropTypes.number,
	currentPage: PropTypes.number,
	loading: PropTypes.bool.isRequired,
	location: PropTypes.object.isRequired,
}

export { IndexPage }

export default
connect(
	({mood}) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'),
		currentPage: mood.get('currentPage'),
	}),
)(IndexPage)