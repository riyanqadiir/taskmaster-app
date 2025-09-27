import { Pagination, Form } from "react-bootstrap";

function PaginationSection({ pagination, setFilter, filter }) {
    const handleFilterChange = (key, value) => {
        setFilter((prev) => {
            return { ...prev, [key]: value };
        });
    };

    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

    return (
        <>
            <Form.Group controlId="filterLimit" className="d-flex align-items-center gap-2 mb-0">
                <Form.Label className="mb-0 text-white">Limit</Form.Label>
                <Form.Select
                    name="limit"
                    value={filter.limit}
                    onChange={(e) =>
                        handleFilterChange(
                            "limit",
                            Number(e.target.value)
                        )
                    }
                    className="form-select-inline form-select-sm"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value={pagination.totalItems}>{pagination.totalItems}</option>
                </Form.Select>
            </Form.Group>


            <Pagination className="my-auto">
                <Pagination.First
                    onClick={() => handleFilterChange("page", 1)}
                    disabled={pagination.currentPage === 1}
                />
                <Pagination.Prev
                    onClick={() => handleFilterChange("page", pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                />

                {pages.map((page) => (
                    <Pagination.Item
                        key={page}
                        active={pagination.currentPage === page}
                        onClick={() => handleFilterChange("page", page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}

                <Pagination.Next
                    onClick={() =>
                        handleFilterChange("page", pagination.currentPage + 1)
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                />
                <Pagination.Last
                    onClick={() => handleFilterChange("page", pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                />
            </Pagination>
        </>
    );
}

export default PaginationSection;
