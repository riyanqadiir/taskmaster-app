import React, { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce';
import { Col, Form } from "react-bootstrap";

function FilterTasks({ filter, setFilter }) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);

    useEffect(() => {
        setFilter((prev) => ({ ...prev, title: debouncedSearch }));
    }, [debouncedSearch, setFilter]);

    const handleFilter = (e) => {
        const { name, value } = e.target;
        if (name === "title") {
            return setSearch(value)
        } else {
            console.log("name : ", name, " value: ", value)
            setFilter((prev) => {
                return { ...prev, [name]: value }
            })
        }

    }
    return (
        <>
            <Col xs={12} md={3} className='filters'>
                <Form.Group controlId="filterStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={filter.status}
                        onChange={handleFilter}
                    >
                        <option value="all">All Tasks</option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="completed">Completed</option>
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col xs={12} md={3} className='filters'>
                <Form.Group controlId="filterSortBy">
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select
                        name="sortBy"
                        value={filter.sortBy}
                        onChange={handleFilter}
                    >
                        <option value="createdAt">Created At</option>
                        <option value="updatedAt">Updated At</option>
                        <option value="completedAt">Completed At</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col xs={12} md={3} className='filters'>
                <Form.Group controlId="filterOrder">
                    <Form.Label>Order</Form.Label>
                    <Form.Select
                        name="order"
                        value={filter.order}
                        onChange={handleFilter}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col xs={12} md={3} className='filters'>
                <Form.Group controlId="filterSearch">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                        name="title"
                        value={search}
                        type="text"
                        placeholder="Search for tasks"
                        onChange={handleFilter}
                    />
                </Form.Group>
            </Col>
        </>
    )
}

export default FilterTasks