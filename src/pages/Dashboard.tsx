import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Project } from '../types/entities';

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/');
                setProjects(response.data);
            } catch (err) {
                setError('Falha ao carregar projetos.');
                console.error(err);
            } finally {
                setLoading(false);
            }

        }
        fetchProjects();
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/projects/', {
                name: newProjectName,
                description: newProjectDescription,
            });

            setProjects([...projects, response.data]);

            setNewProjectName('');
            setNewProjectDescription('');

        } catch (err) {
            console.error("Falha ao criar projeto", err);
        
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    return (
        <div>
            <h1>Dashboard</h1>
            {projects.length === 0 ? (
                <p>Você ainda não possui nenhum projeto, crie um!</p>
            ) : (
                <ul>
                    {projects.map(project => (
                        <li key={project.id}>
                            <Link to={`/projects/${project.id}`}>{project.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <hr />
            <h2>Criar Novo Projeto</h2>
            <form onSubmit={handleCreateProject}>
                <div>
                    <label>Nome do Projeto:</label>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        required
                />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Criar Projeto</button>
            </form>
        </div>
    )
}

export default Dashboard;