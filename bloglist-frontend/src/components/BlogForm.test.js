import React from "react";
import '@testing-library/jest-dom'
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test('correct form submission', async() =>{
    const  mockSubmitHandler = jest.fn()
    const mockBlogObject = {
        title: 'test title',
        author: 'Test Author',
        url: 'test.com',
      }

    const {container} = render(<BlogForm postBlog={mockSubmitHandler}/>)
    const titleField = screen.getByLabelText('Title:')
    const authorField = screen.getByLabelText('Author:')
    const urlField = screen.getByLabelText('Url:')
    const submitButton = container.querySelector('.post-button')

    const user = userEvent.setup()
    await user.click(titleField)
    fireEvent.change(titleField, {target: {value: 'test title'}})
    fireEvent.change(authorField, {target: {value: 'Test Author'}})
    fireEvent.change(urlField, {target: {value: 'test.com'}})
    await user.click(submitButton)
    console.log(mockSubmitHandler.mock.calls[0][0]);

    expect(mockSubmitHandler.mock.calls[0][0]).toStrictEqual(mockBlogObject)
})