import React from "react";
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('hide url and likes', async()=>{
    const blog = {
        title:'testing',
        author:'test user',
        url:'random.url',
        likes:1,
        user: null,
    }


    window.localStorage.setItem(
        'loggedBlogappUser', null
      )

    const {container} = render(<Blog blog={blog}/>)
    

    const viewOpen = container.querySelector('.view-open')
    expect(viewOpen).toHaveStyle('display: none')
})

test('show url and likes', async()=>{
    const blog = {
        title:'testing',
        author:'test user',
        url:'random.url',
        likes:1,
        user: null,
    }

    window.localStorage.setItem(
        'loggedBlogappUser', null
    )    

    const {container} = render(<Blog blog={blog}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const viewOpen = container.querySelector('.view-open')
    expect(viewOpen).not.toHaveStyle('display: none')
})

test('button is called twice when clicked twice', async()=>{
    const mockLike = jest.fn()

    const blog = {
        title:'testing',
        author:'test user',
        url:'random.url',
        likes:1,
        user: null,
    }

    window.localStorage.setItem(
        'loggedBlogappUser', null
    )

    render(<Blog blog={blog} handleLike={mockLike}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
})