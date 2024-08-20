import { useEffect, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import { Popup } from 'react-leaflet'
import axios from 'axios'
import Leatleaf from 'leaflet'
import img from './transbrasil.png'


function Mapa(){
    const [estacoes, setEstacoes] = useState([]);
    const [data, setData] = useState([]);
  
    useEffect(() => {
      axios.get('https://dados.mobilidade.rio/gps/brt').then(res => setData(res.data.veiculos.filter(x => parseInt(x.linha) != 0 && x.ignicao != 0 && x.velocidade != 0)))
      setInterval(() => {
        console.log("chamou")
        axios.get('https://dados.mobilidade.rio/gps/brt').then(res => setData(res.data.veiculos.filter(x => parseInt(x.linha) != 0 && x.ignicao != 0 && x.velocidade != 0)))
      }, 20000);  
    }, []);

    

    useEffect(() => {
        axios.get('https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Hosted/Esta%C3%A7%C3%B5es_BRT/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json').then(res => setEstacoes(res.data.features))
    }, []);

    let posicao = [-22.947864, -43.391729]
    function define_icones_estacoes(corredor){
      if (corredor === "Transolimpica"){
        return Leatleaf.icon({
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BRT_TransOlimpica_logo.svg/180px-BRT_TransOlimpica_logo.svg.png',
          iconSize: [40, 40],
          popupAnchor: [0, -25],
        })
      }
      else if(corredor === "Transoeste"){
        return Leatleaf.icon({
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/BRT_TransOeste_logo.svg/1024px-BRT_TransOeste_logo.svg.png',
          iconSize: [40, 40],
          popupAnchor: [0, -25],
        })
        
      }
      else if(corredor === "Transcarioca"){
        return Leatleaf.icon({
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/BRT_TransCarioca_logo.svg/1024px-BRT_TransCarioca_logo.svg.png',
          iconSize: [40, 40],
          popupAnchor: [0, -25],
        })
        
      }
      else{
        return Leatleaf.icon({
          iconUrl: img,
          iconSize: [40, 40],
          popupAnchor: [0, -25],
        })
      }
    }

    return (
        <>
        <MapContainer center={posicao} zoom={13} style={{ height: '80vh', width: '60wh' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {estacoes.map(x=>
            <Marker position={x.geometry.points[0].slice().reverse()} icon={define_icones_estacoes(x.attributes.corredor)} >
                <Popup>{x.attributes.nome}</Popup>
            </Marker> 
          )}
          {data.map(x =>
            <Marker position={[x.latitude, x.longitude]}>
              <Popup>
                <h1>Codigo {x.codigo}</h1>
                <p>Trajeto {x.trajeto}</p>
                <p>Sentido {x.sentido}</p>
                <p>Placa {x.placa}</p>
                <p>Linha {x.linha}</p>
                <p>DataHora {Date(x.dataHora)}</p>
                <p>velocidade {x.velocidade}</p>
                <p>Migracao trajeto {x.id_migracao_trajeto}</p>
                <p>Hodometro {x.hodometro}</p>
                <p>Direcao {x.direcao}</p>
                <p>Ignicao {x.ignicao}</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </>
    )
}

export default Mapa;