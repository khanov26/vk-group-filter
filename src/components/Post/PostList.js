import React, {Component} from 'react';
import Post from "./Post";

export default class PostList extends Component {
    static parseProfiles(profiles) {
        let data = {};
        for (let profile of profiles) {
            data[profile.id] = profile;
        }

        return data;
    }

    render() {
        let profiles = PostList.parseProfiles(this.props.profiles);

        return (
            <div>
                {this.props.posts.map(post => <Post key={post.id} post={post} profile={profiles[post.from_id]} />)}
            </div>
        )
    }
}