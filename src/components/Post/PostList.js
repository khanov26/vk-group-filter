import React, {Component} from 'react';
import Post from "./Post";
import InfiniteScroll from 'react-infinite-scroller';

export default class PostList extends Component {
    render() {
        let profiles = this.props.profiles.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        return (
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.props.getPosts}
                hasMore={true}
                loader={<div className="loader" key={0}>Loading ...</div>}
            >
                {this.props.posts.map(post => <Post key={post.id} post={post} profile={profiles[post.from_id]} />)}
            </InfiniteScroll>
        )
    }
}