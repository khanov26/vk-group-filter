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
            posts: [],
            profiles: [],
            postFilters: {
                withPhotoOnly: {
                    active: false,
                    func: post => {
                        if (!post.attachments) return false;

                        const photos = post.attachments.filter(attachmentItem => attachmentItem.type === "photo");
                        return photos.length !== 0;
                    },
                }
            }
        };

        this.handleGroupLinkChange = this.handleGroupLinkChange.bind(this);
        this.handleGroupLinkBlur = this.handleGroupLinkBlur.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.handlePostFiltersChanges = this.handlePostFiltersChanges.bind(this);
    }

    handlePostFiltersChanges(filterName, isActive) {
        const postFilters = {...this.state.postFilters};
        postFilters[filterName].active = isActive;
        this.setState({
            postFilters,
            posts: [],
            profiles: []
        });

        this.getPosts(0);
    }

    getActiveFilters() {
        let activeFiltersFunctions = [];
        const postFilters = this.state.postFilters;
        for (let filterName in postFilters) {
            const currentFilter = postFilters[filterName];
            if (currentFilter.active) {
                activeFiltersFunctions.push(currentFilter.func);
            }
        }

        return activeFiltersFunctions;
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

        this.groupScreenName = this.getGroupScreenName(groupLink);

        if (this.groupScreenName === this.lastGroupScreenName) {
            return;
        }

        let groupInfo = await this.getGroupInfo(this.groupScreenName);
        if (!groupInfo.isSuccess) {
            this.isRequestSuccess = false;
            return;
        }

        let {name: groupName, image: groupImage} = groupInfo;
        this.isRequestSuccess = true;
        this.lastGroupScreenName = this.groupScreenName;
        this.setState({
            groupName,
            groupImage,
            posts: [],
        });
        await this.getPosts(0);
    }

    async getGroupInfo(screenName) {
        let response = await this.vk.call('groups.getById', {
            group_id: screenName
        });

        if (response.isSuccess) {
            return {
                isSuccess: true,
                name: response.data[0].name,
                image: response.data[0].photo_200
            }
        }

        return response;
    }

    async getPosts(page) {
        if (this.isRequestSuccess) {
            const postsPerPage = 50;
            let response = await this.vk.call('wall.get', {
                domain: this.groupScreenName,
                count: postsPerPage,
                extended: 1,
                filter: "others",
                offset: page * postsPerPage,
            });

            if (response.isSuccess) {
                let {items: posts, profiles} = response.data;

                const activeFilters = this.getActiveFilters();
                for (let currentFilter of activeFilters) {
                    posts = posts.filter(currentFilter);
                }

                this.setState({
                    posts: this.state.posts.concat(posts),
                    profiles: this.state.profiles.concat(profiles),
                });
            }
        }
    }

    init() {
        this.vk = new VK({appId: "7922207"});
    }

    getGroupScreenName(link) {
        let regex = /vk\.com\/(\w+)/;
        if (regex.test(link)) {
            return link.match(regex)[1];
        }

        return link;
    }

    render() {
        return (
            <main className="App">
                <div className="container">
                    <div className="row">
                        <aside className="col-lg-3 align-self-start aside">
                            {this.isRequestSuccess
                                ? <GroupInfo name={this.state.groupName} image={this.state.groupImage}/>
                                : ''
                            }
                            <Filters groupLink={this.state.groupLink}
                                     onGroupLinkChange={this.handleGroupLinkChange}
                                     onGroupLinkBlur={this.handleGroupLinkBlur}
                                     error={this.isRequestSuccess === false}
                                     filters={this.state.postFilters}
                                     onChange={this.handlePostFiltersChanges}
                            />
                        </aside>
                        <div className="col-lg-9 mt-3 mt-lg-0 posts">
                            {this.state.posts.length !== 0 &&
                            <PostList posts={this.state.posts} profiles={this.state.profiles} getPosts={this.getPosts}/>}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
