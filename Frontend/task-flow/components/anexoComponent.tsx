import { VisualizarAnexo } from "@/types/AnexoInterface";
import Constants from 'expo-constants';
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, PressableStateCallbackType } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import api from "@/services/api";

export default function AnexoComponent({ anexo, onDelete }: { anexo: VisualizarAnexo, onDelete: (id: number, nome: string) => void }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [base64Data, setBase64Data] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    
    const { SERVER_ROUTE } = Constants.expoConfig?.extra || {};
    const urlConteudo = `${SERVER_ROUTE}${anexo.urlConteudo}`; 
    const urlBaixar = `${SERVER_ROUTE}${anexo.urlBaixar}`;
    
    const isImagem = anexo.tipo.startsWith('image/');
    const isAudio = anexo.tipo.startsWith('audio/');

    const handleAudioPlayback = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            setIsDownloading(true);
            try {
                const res = await api.get(urlBaixar, { responseType: "blob" });
                const blob = res.data as Blob;
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = (reader.result as string).split(",")[1];
                    const safeName = `audio_${anexo.id}.mp3`;
                    const localUri = FileSystem.documentDirectory + safeName;
                    await FileSystem.writeAsStringAsync(localUri, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                    });

                    const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: localUri },
                    { shouldPlay: true }
                    );
                    setSound(newSound);
                    setIsPlaying(true);
                    newSound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                          setIsPlaying(false);
                        }
                    });
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("Erro ao baixar/tocar áudio:", err);
                Alert.alert("Erro", "Não foi possível tocar o áudio.");
            } finally {
                setIsDownloading(false);
            }
        };
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        Alert.alert("Download", `Baixando ${anexo.nome}...`);

        try {
            const resultado = await api.get(urlBaixar, {
                responseType: 'blob'
            })
            const blob = resultado.data as Blob;
            const reader = new FileReader();

            reader.onloadend = async () => {
                const data = (reader.result as string).split(",")[1];
                const safeName = anexo.nome.replace(/[^a-zA-Z0-9.]/g, "_");
                const fileUri = FileSystem.documentDirectory + safeName;
                await FileSystem.writeAsStringAsync(fileUri, data, {
                encoding: FileSystem.EncodingType.Base64
                });
                Alert.alert("Download concluído", `Arquivo salvo em:\n${fileUri}`);
                setIsDownloading(false);
            };
            reader.readAsDataURL(blob);

        } catch (error) {
            console.error('Erro de download:', error);
            Alert.alert('Erro de Download', 'Não foi possível baixar o anexo.');
        } finally {
            setIsDownloading(false);
        }
    }

    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

    useEffect(() => {
        if (isImagem) {
            (async () => {
                try {
                  const res = await api.get(urlConteudo, {
                    responseType: 'blob',
                  });
                  const blob = res.data as Blob;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBase64Data((reader.result as string).split(",")[1]);
                  };
                  reader.readAsDataURL(blob);
                } catch {
                  setBase64Data(null);
                }
              })();
            }
          }, [urlConteudo]);
          
    const handlePress = () => {
        if (isImagem) {
            setShowModal(true);
        } else if (isAudio) {
            handleAudioPlayback();
        }
    }

    const handleLongPress = () => {
        Alert.alert(
            "Remover anexo",
            `Deseja remover "${anexo.nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => onDelete(anexo.id, anexo.nome) 
                }
            ]
        );
    };

      return (
        <Pressable
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={500}
        >
            {({ pressed }: PressableStateCallbackType) => (
            <View style={[styles.itemContainer, pressed && styles.itemContainerPressed]}>
                {isImagem && base64Data ? (
                <>
                    <Image
                    source={{ uri: `data:${anexo.tipo};base64,${base64Data}` }}
                    style={styles.thumbnail}
                    />

                    <Modal 
                        visible={showModal} 
                        transparent 
                        onRequestClose={() => setShowModal(false)}
                        animationType="fade"
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPressOut={() => setShowModal(false)} 
                        >
                            <View 
                                onStartShouldSetResponder={() => true} 
                                onResponderRelease={(e) => e.stopPropagation()}
                                style={styles.modalContentContainer}
                            >
                                <Image
                                    source={{ uri: `data:${anexo.tipo};base64,${base64Data}` }}
                                    style={styles.expandedImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    </>
                ) : isImagem && !base64Data ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : isAudio ? (
                    <IconButton
                    icon={isPlaying ? "pause-circle" : "play-circle"}
                    size={40}
                    disabled={isDownloading}
                    style={styles.sound}
                    />
                ) : (
                    <IconButton icon="file-outline" size={40} disabled />
                )}

                <Text numberOfLines={1}>
                    {anexo.nome}
                </Text>

                <IconButton
                    icon="download"
                    size={20}
                    iconColor="#6750A4"
                    accessibilityLabel="Baixar" 
                    onPress={handleDownload}
                    disabled={isDownloading}
                    style={styles.downloadButton}
                />
                {isDownloading && <Text style={styles.downloadingText}>Baixando...</Text>}
            </View>
            )}
        </Pressable>
      );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginRight: 10,
        alignItems: 'center',
        width: 120, 
        position: 'relative',
    },
    itemContainerPressed: { 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        borderRadius: 8,
    },
    thumbnail: { 
        width: 100, 
        height: 100, 
        borderRadius: 8, 
        backgroundColor: "#eee" 
    },
    sound: { 
        width: 100, 
        height: 87, 
    },
    downloadButton: {
        margin: 0, 
        padding: 0,
    },
    downloadingText: {
        fontSize: 10,
        color: '#007AFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center"
      },
    modalContentContainer: {
        width: "90%",
        height: "60%", 
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedImage: { 
        width: "90%", 
        height: "100%" 
    }
});