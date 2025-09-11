import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {fetchTasks,updateTask} from "../../api/tasksApi"
import { useAuth } from "../../context/AuthContext";
import StatusCard from "./StatusCard";
export default function Dashboard() {
    const [loading, setLoading] = useState({
        todo: true,
        progress: true,
        done: true,
    });
    const [todo, setTodo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const {user} = useAuth();
    const loadTasks = async () => {
        try {
            setLoading({ todo: true, progress: true, done: true });

            const [todoRes, progRes, doneRes] = await Promise.all([
                fetchTasks({ status: "not_started" }),
                fetchTasks({ status: "in_progress" }),
                fetchTasks({ status: "completed"} ),
            ]);

            setTodo(todoRes.data.tasks || []);
            setInProgress(progRes.data.tasks || []);
            setCompleted(doneRes.data.tasks || []);
        } catch (err) {
            console.error("Error loading tasks:", err);
        } finally {
            setLoading({ todo: false, progress: false, done: false });
        }
    };

    const markComplete = async (taskId) => {
        try {
            await updateTask(taskId,{ status: "completed" });
            loadTasks();
        } catch (err) {
            console.error("Error marking task complete:", err);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <Container fluid className="mt-3 text-center">
            <h1>Welcome! {user?.firstName ?? "" } {user?.lastName ?? "" } </h1>
            <Row>
                <Col xs={12} lg={4}>
                    <StatusCard title="To-Do" tasks={todo} loading={loading.todo} onComplete={markComplete} />
                </Col>
                <Col xs={12} lg={4}>
                    <StatusCard
                        title="In-Progress"
                        tasks={inProgress}
                        loading={loading.progress}
                        onComplete={markComplete}
                    />
                </Col>
                <Col xs={12} lg={4}>
                    <StatusCard title="Completed" tasks={completed} loading={loading.done} />
                </Col>
            </Row>
        </Container>
    );
}
