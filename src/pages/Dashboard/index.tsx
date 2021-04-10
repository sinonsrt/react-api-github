import React, { useState, FormEvent, useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import logoImg from '../../assets/github-logo.svg'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import { Title, Form, Repositories, Error } from './styles'

interface Repository {
    full_name: string,
    owner: {
        login: string;
        avatar_url: string;
    };
    description: string,
}

const Dashboard: React.FC = () => {
    const [newRep, setNewRep] = useState('')
    const [inputError, setInputError] = useState('');
    const [ repositories, setRepositories ] = useState<Repository[]>(() => {    
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')

        if(storagedRepositories){
            return JSON.parse(storagedRepositories);
        }
    })

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories)   )
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        //add new repository
        // consumir a api do git e buscando e dps salvar no useState
        event.preventDefault()

        if (!newRep) {
            setInputError('Digite um repositório válido!');
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/${newRep}`)
            const repository = response.data

            setRepositories([...repositories, repository])
            setNewRep('');
            setInputError('');
        } catch (err){
            setInputError('Erro na busca pelo repositório!')
        }
    }
    return (
       <>
            <img src={logoImg} alt="Github Logo" />
            <Title> Explore repositórios no GitHub </Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                    value={newRep}
                    //puxar valor do input
                    onChange={(e) => setNewRep(e.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit"> Pesquisar </button>
            </Form>
            { inputError && <Error> {inputError} </Error>}
            <Repositories>
                {repositories.map(repository => ( 
                    <Link key={repository.full_name} to={`/repository/${repository.full_name    }`}>
                        <img src={repository.owner.avatar_url} 
                        alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={ 20 } />
                    </Link>
                ))}
            </Repositories>
       </>
    );
};

export default Dashboard;