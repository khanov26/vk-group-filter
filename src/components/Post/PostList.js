import React, {Component} from 'react';
import Post from "./Post";

export default class PostList extends Component {
    render() {
        let profiles = this.props.profiles.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        return (
            <div>
                {this.props.posts.map(post => <Post key={post.id} post={post} profile={profiles[post.from_id]} />)}
            </div>
        )
    }
}