// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle', pokemon: null, error: null});

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    setState({...state, status: 'pending'});

    fetchPokemon(pokemonName).then(
      (pokemonData) => {
        setState({status: 'resolved', pokemon: pokemonData, error: null});
      },
      (error) => {
        setState({status: 'rejected', pokemon: null, error: error});
      },
    );

    return () => setState({status: 'idle', pokemon: null, error: null});
  }, [pokemonName]);

  switch (state.status) {
    case 'pending': return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved': return <PokemonDataView pokemon={state.pokemon} />;
    case 'rejected': throw state.error;
    default: return 'Submit a pokemon';
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary resetKeys={[pokemonName]} onReset={() => setPokemonName('')} FallbackComponent={ErrorFallback}>
            <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
