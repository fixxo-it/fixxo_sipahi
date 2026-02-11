'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icon in Leaflet + Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

function LocationMarker({ onLocationSelect, location }: {
    onLocationSelect: (lat: number, lng: number) => void
    location: { lat: number, lng: number } | null
}) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })

    return location === null ? null : (
        <Marker position={location} icon={icon} />
    )
}

export default function MapPicker({ onLocationSelect, location }: {
    onLocationSelect: (lat: number, lng: number) => void
    location: { lat: number, lng: number } | null
}) {
    const center = { lat: 19.0760, lng: 72.8777 } // Default to Mumbai

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={onLocationSelect} location={location} />
        </MapContainer>
    )
}
