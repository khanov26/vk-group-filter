import './App.scss';
import GroupInfo from '../GroupInfo/GroupInfo';
import PostList from "../Post/PostList";
import Filters from '../Filters/Filters';
import React, {Component} from "react";
import VK from "../../js/VK";

class App extends Component {
    vk = null;
    lastGroupScreenName = null;
    isRequestSuccess = null;

    constructor(props) {
        super(props);
        this.init();

        this.state = {
            groupLink: null,
            groupName: null,
            groupImage: null,
            posts: null,
            profiles: null
        };

        this.handleGroupLinkChange = this.handleGroupLinkChange.bind(this);
        this.handleGroupLinkBlur = this.handleGroupLinkBlur.bind(this);
    }

    handleGroupLinkChange(value) {
        this.setState({
            groupLink: value
        })
    }

    async handleGroupLinkBlur(groupLink) {
        if (!groupLink) {
            return;
        }

        let groupScreenName = this.getGroupScreenName(groupLink);

        if (groupScreenName === this.lastGroupScreenName) {
            return;
        }

        let {isRequestSuccess, name: groupName, image: groupImage} = await this.getGroupInfo(groupScreenName);
        this.isRequestSuccess = isRequestSuccess;
        this.lastGroupScreenName = groupScreenName;
        this.setState({groupName, groupImage});

        let {posts, profiles} = await this.getPosts(groupScreenName);
        this.setState({posts, profiles});
    }

    async getGroupInfo(screenName) {
        let response = await this.vk.call('groups.getById', {
            group_id: screenName
        });


        let isRequestSuccess;
        let name;
        let image;

        if (response.response) {
            isRequestSuccess = true;
            ({name, photo_200: image} = response.response[0]);
        } else {
            isRequestSuccess = false;
            name = null;
            image = null;
        }

        return {
            isRequestSuccess,
            name,
            image
        };
    }

    async getPosts(groupScreenName) {
        let response = await this.vk.call('wall.get', {
            domain: groupScreenName,
            count: 10,
            extended: 1,
        });

        if (response.response) {
            let {items:posts, profiles} = response.response;
            return {posts, profiles};
        }

        return null;
    }

    init() {
        let token = window.localStorage.getItem("token");
        let expires = window.localStorage.getItem("expires");

        if (!token || expires < Date.now()) {
            if (window.location.href.includes("access_token")) {
                token = this.parseURL("access_token", window.location.href);
                expires = +this.parseURL("expires_in", window.location.href) * 1000 + Date.now();
                window.localStorage.setItem("token", token);
                window.localStorage.setItem("expires", expires);
                this.vk = new VK({token: token});
            } else {
                this.vk = new VK({appId: "7820044"});
            }
        } else {
            this.vk = new VK({token: token});
        }
    }

    getGroupScreenName(link) {
        let regex = /vk\.com\/(\w+)/;
        if (regex.test(link)) {
            return link.match(regex)[1];
        }

        return link;
    }

    parseURL(needle, subject) {
        let regex = new RegExp(`${needle}=([^&]+)`);
        let result = subject.match(regex);
        return result[1] || null;
    }

    render() {
        return (
            <main className="App">
                <div className="container">
                    <div className="row">
                        <aside className="col-lg-3 filters order-lg-2">
                            {this.isRequestSuccess
                                ? <GroupInfo name={this.state.groupName} image={this.state.groupImage}/>
                                : ''
                            }
                            <Filters groupLink={this.state.groupLink}
                                     onGroupLinkChange={this.handleGroupLinkChange}
                                     onGroupLinkBlur={this.handleGroupLinkBlur}
                                     error={this.isRequestSuccess === false}
                            />
                        </aside>
                        <div className="col-lg-9 mt-3 mt-lg-0 posts order-1">
                            {this.state.posts &&
                            <PostList posts={this.state.posts} profiles={this.state.profiles}/>}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
