import React from 'react'

function SavedPosts({ activeTab }) {
    return (
        <>
            <div className={`tab-pane ${activeTab === 'saved-posts' ? 'active' : ''}`} id="saved-posts">
                <h1>saved posts</h1>
            </div>
        </>
    )
}

export default SavedPosts
