import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import api from '../services/api';
import type { Project, Task } from '../types/entities';
import styles from './ProjectDetail.module.css';

const ProjectDetail = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
        try {
            const response = await api.get(`/projects/${id}/`);
            setProject(response.data);
            setEditedName(response.data.name);
            setEditedDescription(response.data.description || '');
        } catch (err) {
            setError('Falha ao carregar os detalhes do projeto.');
            console.error(err);
        } finally {
          setLoading(false);
        }
      };
      if (id) {
        fetchProjectDetails();
      }
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;

    try {
      const response = await api.post('/tasks/', {
        title: newTaskTitle,
        description: newTaskDescription,
        due_date: newTaskDueDate || null, // Envia nulo se a data estiver vazia
        project: project.id,
      });

      setProject({ ...project, tasks: [...project.tasks, response.data] });

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');

      setIsAddTaskFormVisible(false);

    } catch (err) {
      console.error('Falha ao criar tarefa', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!project) return;

    try {
      await api.delete(`/tasks/${taskId}/`);
      setProject({
        ...project,
        tasks: project.tasks.filter(task => task.id !== taskId),
      });
    } catch (err) {
      console.error('Falha ao deletar tarefa', err);
    }
  };
  
  const handleUpdateTaskStatus = async (task: Task, newStatus: string) => {
    if (!project) return;
    

    try {
      const response = await api.patch(`/tasks/${task.id}/`, {
        status: newStatus,
      });
      setProject({
        ...project,
        tasks: project.tasks.map(t => t.id === task.id ? response.data : t),
      });
    } catch (err) {
      console.error('Falha ao atualizar status da tarefa', err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Tem certeza que deseja excluir este projeto e todas as suas tarefas? Esta ação é irreversível.")) {
      try {
        await api.delete(`/projects/${id}/`);
        alert('Projeto excluído com sucesso!');
        navigate('/');
      } catch (err) {
        console.error("Falha ao excluir o projeto", err);
        alert('Ocorreu um erro ao excluir o projeto.');
      }
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await api.patch(`/projects/${id}/`, {
        name: editedName,
        description: editedDescription,
      });
      setProject(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Falha ao atualizar o projeto", err);
      alert('Ocorreu um erro ao atualizar o projeto.');
    }
  };


  if (loading) return <p>Carregando detalhes do projeto...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            {isEditing ? (
                <div className={styles.formContainer}>
                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    <br />
                    <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                    <br />
                    <button onClick={handleUpdateProject}>Salvar</button>
                    <button style={{ marginLeft: '10px' }} onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
            ) : (
                <div >
                    <h1>{project?.name}</h1>
                    <p>{project?.description || 'Este projeto não tem uma descrição.'}</p>
                    <button onClick={() => setIsEditing(true)}>Editar Projeto</button>
                    <button onClick={handleDeleteProject} className={styles.deleteButton}>Excluir Projeto</button>
                </div>
            )}
        </div>
      
      <h2>Tarefas</h2>
      {project?.tasks && project.tasks.length > 0 ? (
        <ul className={styles.taskList}>
            {project.tasks.map(task => {
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                const isInProgress = task.status === 'in_progress';
                const isPending = task.status === 'pending';

                let taskItemClasses = styles.taskItem;
                if (isOverdue) {
                    taskItemClasses += ` ${styles.taskOverdue}`;
                } else if (isInProgress) {
                    taskItemClasses += ` ${styles.taskInProgress}`;
                } else if (isPending) {
                    taskItemClasses += ` ${styles.taskPending}`;
                }

                return (
                    <li key={task.id} className={taskItemClasses}>
                        <div className={styles.taskInfo}>
                            <strong style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                            {task.title}
                            </strong>
                            {task.due_date && <p><small>Prazo: {new Date(task.due_date).toLocaleDateString()}</small></p>}
                            {isOverdue && <span className={`${styles.statusBadge} ${styles.badgeOverdue}`}>TAREFA ATRASADA</span>}
                            {isInProgress && <span className={`${styles.statusBadge} ${styles.badgeInProgress}`}>EM PROGRESSO</span>}
                            {isPending && <span className={`${styles.statusBadge} ${styles.badgePending}`}>EM ABERTO</span>}
                        </div>
                        <div className={styles.taskActions}>
                            {task.status === 'pending' && (
                            <button onClick={() => handleUpdateTaskStatus(task, 'in_progress')}>
                                Iniciar Tarefa
                            </button>
                            )}
                            {task.status === 'in_progress' && (
                            <button onClick={() => handleUpdateTaskStatus(task, 'completed')}>
                                Concluir
                            </button>
                            )}
                            {task.status === 'completed' && (
                            <button onClick={() => handleUpdateTaskStatus(task, 'pending')}>
                                Reabrir
                            </button>
                            )}
                            <button onClick={() => handleDeleteTask(task.id)}>Deletar</button>
                        </div>
                    </li>
                );
            })}
        </ul>
      ) : (
        <p>Nenhuma tarefa neste projeto ainda.</p>
      )}

      {!isAddTaskFormVisible && (
        <button onClick={() => setIsAddTaskFormVisible(true)}>
            Adicionar Nova Tarefa
        </button>
      )}

      {isAddTaskFormVisible && (
        <div className={styles.formContainer}>
            <h3>Adicionar Nova Tarefa</h3>
            <form onSubmit={handleCreateTask}>
                <div>
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Título da tarefa..."
                        required
                    />
                </div>
                <div>
                    <textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Descrição (opcional)..."
                    />
                </div>
                <div>
                    <label>Data de Vencimento (opcional):</label>
                    <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                </div>
                <button type="submit">Adicionar Tarefa</button>
                <button type="button" onClick={() => setIsAddTaskFormVisible(false)} style={{ marginLeft: '10px' }}>
                    Cancelar
                </button>
            </form>
        </div>
        )}
    </div>
  );
};

export default ProjectDetail;