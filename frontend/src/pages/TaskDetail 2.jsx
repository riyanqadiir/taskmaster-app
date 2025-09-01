import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Spinner, Alert, Card, Badge, Container } from "react-bootstrap";
import TaskCard from '../components/task/TaskCard';
function TaskDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [task, setTask] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) { navigate("/tasks"); return }
        const getTaskDetail = async (taskId) => {
            console.log(taskId)
            try {
                const response = await api.get(`/tasks/detail/${taskId}`)
                if (response.status === 200) {
                    console.log(response.data.task)
                    setTask(response.data.task)
                }
            } catch (err) {
                console.log(err.response.data?.message ?? "Failed to load task")
                setErr(err.response?.data?.message || "Failed to load task");
            } finally {
                setLoading(false)
            }
        }
        getTaskDetail(id)
    }, [id, navigate])

    if (loading) return <Spinner className='m-3' />
    if (err) return <Alert variant='danger' className='m-3' >{err}</Alert>
    if (!task) return null;

    return (
        <>  
        <Container>
            <TaskCard task={task} />
        </Container>
        </>
    )
}

export default TaskDetail

