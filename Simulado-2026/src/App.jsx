import { useState } from 'react'
import { dadosClima, buscarCidade } from './DadosClima'
import { getInfoWmo } from './CodigosWmo'
import './App.css'

function App() {
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState(dadosClima[0]) // Inicia com Brasília
  const [erroBusca, setErroBusca] = useState(false)

  function handleBuscar(e) {
    e.preventDefault()
    const resultado = buscarCidade(busca)

    if (resultado) {
      setCidade(resultado)
      setErroBusca(false)
    } else {
      setErroBusca(true)
    }
  }

  function formatarHora(isoTime) {
    if (!isoTime) return ''
    const partes = isoTime.split('T')
    return partes[1] || isoTime
  }

  const infoClimaAtual = cidade ? getInfoWmo(cidade.current.weather_code) : null

  return (
    <div className="app-wrapper">
      {/* Cabeçalho e Barra de Busca */}
      <header className="top-bar">
        <div className="brand">
          <img src="./src/icons/solchuva.svg" alt="Sol Chuva" className="brand-logo" />
          <h1>Sol Chuva</h1>
        </div>

        <form className="search-form" onSubmit={handleBuscar}>
          <input
            type="text"
            value={busca}
            onChange={e => {
              setBusca(e.target.value)
              setErroBusca(false)
            }}
            placeholder="Buscar cidade (ex: Brasília, Salvador, Manaus...)"
            className="search-input"
          />
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </header>

      {erroBusca && (
        <p className="search-error">
          Cidade não encontrada. Tente selecionar uma das opções abaixo.
        </p>
      )}

      {/* Card Principal (Inspirado na imagem de referência) */}
      {cidade && (
        <section className="weather-main-card">
          <div className="weather-card-header">
            <div>
              <h2 className="city-title">{cidade.name}</h2>
              <p className="city-subtitle">
                {cidade.admin1} — {cidade.country}
              </p>
            </div>
            <span className="updated-time">
              Atualizado às {formatarHora(cidade.current.time)}
            </span>
          </div>

          <div className="weather-card-body">
            {/* Destaque Temperatura (Esquerda) */}
            <div className="weather-hero">
              <span className="weather-hero-icon" aria-hidden="true">
                {infoClimaAtual.icone}
              </span>
              <div className="weather-hero-temp">
                <strong>{cidade.current.temperature_2m}°C</strong>
                <span>{infoClimaAtual.descricao}</span>
              </div>
            </div>

            {/* Grid 2x3 de Métricas (Direita) */}
            <div className="weather-metrics-grid">
              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-red">🌡️</span> Sensação
                </span>
                <strong className="metric-value">
                  {cidade.current.apparent_temperature}°C
                </strong>
              </div>

              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-blue">💧</span> Umidade
                </span>
                <strong className="metric-value">
                  {cidade.current.relative_humidity_2m}%
                </strong>
              </div>

              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-teal">🍃</span> Vento
                </span>
                <strong className="metric-value">
                  {cidade.current.wind_speed_10m} km/h
                </strong>
              </div>

              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-blue">💧</span> Precipitação
                </span>
                <strong className="metric-value">
                  {cidade.current.precipitation} mm
                </strong>
              </div>

              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-yellow">☀️</span> Índice UV
                </span>
                <strong className="metric-value">
                  {cidade.current.uv_index}
                </strong>
              </div>

              <div className="metric-pill">
                <span className="metric-label">
                  <span className="metric-icon icon-orange">🌅</span> Nascer / Pôr do sol
                </span>
                <strong className="metric-value">
                  {cidade.current.sunrise} / {cidade.current.sunset}
                </strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seção: Explorar Mais Cidades */}
      <section className="explore-section">
        <h3 className="explore-title">Explorar cidades</h3>
        <div className="cities-grid">
          {dadosClima.map(item => {
            const info = getInfoWmo(item.current.weather_code)
            const isSelected = cidade?.id === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCidade(item)
                  setErroBusca(false)
                }}
                className={`city-explore-card ${isSelected ? 'active' : ''}`}
              >
                <div className="explore-card-top">
                  <span className="explore-icon">{info.icone}</span>
                  <strong className="explore-temp">
                    {item.current.temperature_2m}°C
                  </strong>
                </div>
                <div className="explore-card-bottom">
                  <span className="explore-name">{item.name}</span>
                  <span className="explore-region">{item.admin1}</span>
                  <span className="explore-desc">{info.descricao}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default App