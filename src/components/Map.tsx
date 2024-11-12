// import { useEffect, useRef } from 'react'
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'

// interface MapProps {
//   orders: Array<{
//     id: string;
//     lat: number;
//     lng: number;
//   }>;
// }

// export default function Map({ orders }: MapProps) {
//   const mapRef = useRef<any>(null); // create a ref for the map container
//     console.log(orders);
    
//   useEffect(() => {
//     if (!mapRef.current) {
//       // This ensures that the map container is initialized only once
//       return;
//     }

//     // Fix for default marker icon in react-leaflet
//     if (!L.Icon.Default.prototype._getIconUrl) {
//       delete L.Icon.Default.prototype._getIconUrl
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl: '/marker-icon-2x.png',
//         iconUrl: '/marker-icon.png',
//         shadowUrl: '/marker-shadow.png',
//       })
//     }

//     // We don’t need to reinitialize the map, just ensure the icons are set once
//   }, []);

//   return (
//     <MapContainer
//       ref={mapRef} // Attach the ref to the MapContainer
//       center={[51.505, -0.09]} // Default center, adjust based on orders
//       zoom={13}
//       style={{ height: '100%', width: '100%' }}
//       whenCreated={map => {
//         // Ensure map is not initialized multiple times
//         map.invalidateSize(); // Adjust map size after mount
//       }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {orders.map((order) => (
//         <Marker key={order.id} position={[order.lat, order.lng]}>
//           <Popup>
//             Order ID: {order.id}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   )
// }
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png', // URL to a custom icon (or use your own)
  iconRetinaUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png',
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup position relative to the icon
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export default function Map({ orders }: MapProps) {
  console.log(orders);
  
  return (
    <MapContainer
      center={[19.248104, 72.869469]}
      zoom={12}
      style={{ height: '380px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orders.map((order) => (
        <Marker key={order.id} position={[order.lat, order.lng]} icon={customIcon}>
          <Popup>Order ID: {order.id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
