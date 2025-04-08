import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BASE_URL } from '../config'; // Ensure this is set to 'http://127.0.0.1:8000'
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const PostFarmer = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null); // Tracks which post’s menu is open

  useEffect(() => {
    const getMobile = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('mobile');
        console.log('Mobile retrieved from AsyncStorage:', storedMobile);
        if (storedMobile) {
          setMobile(storedMobile);
        } else {
          console.warn('No mobile number found in AsyncStorage');
        }
      } catch (err) {
        console.error('Error retrieving mobile from AsyncStorage:', err);
      }
    };
    getMobile();
    fetchPosts();
    updateCurrentTime();
    const timeInterval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/get-posts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const shuffledPosts = result.data.sort(() => Math.random() - 0.5);
        setPosts(shuffledPosts);
      } else {
        setError(result.detail || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateCurrentTime = () => {
    setCurrentTime(new Date());
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    updateCurrentTime();
  };

  const formatTimestamp = (timestamp) => {
    const timestampStr = timestamp.replace('Nepal Standard Time', '+0545');
    const postDate = new Date(timestampStr);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 7) return postDate.toLocaleDateString();
    else if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    else if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    else if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    else return 'Just now';
  };

  const getHealthStatusColor = (status) => {
    return status === 'healthy' ? '#4CAF50' : '#FF5252';
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleDeletePost = async (postId) => {
    if (!mobile) {
      Alert.alert('Error', 'Please log in to delete posts');
      setMenuVisible(null);
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setMenuVisible(null) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`Attempting to delete post ${postId} with mobile ${mobile}`);
              const response = await fetch(`${BASE_URL}/delete-post/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile }),
              });

              const result = await response.json();
              console.log('Delete response:', result);

              if (!response.ok) {
                throw new Error(result.detail || `HTTP error! Status: ${response.status}`);
              }

              if (result.success) {
                console.log(`Post ${postId} deleted successfully`);
                setPosts(posts.filter((post) => post._id !== postId));
                Alert.alert('Success', 'Post deleted successfully');
              } else {
                Alert.alert('Error', result.detail || 'Failed to delete post');
              }
            } catch (error) {
              console.error('Error deleting post:', error.message);
              Alert.alert('Error', `Failed to delete post: ${error.message}`);
            }
            setMenuVisible(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleMenuPress = (postId) => {
    setMenuVisible(menuVisible === postId ? null : postId);
  };

  const handleHomePress = () => router.push('/FarmerTab/Index');
  const handlePostsPress = () => router.push('/FarmerTab/PostFarmer');

  if (error) {
    return (
      <LinearGradient colors={['#f5f7f6', '#c8e6c9']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f5f7f6', '#c8e6c9']} style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
        >
          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts available</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.expertAvatarContainer}>
                    <Text style={styles.expertInitials}>
                      {post.expert_name.split(' ').map(name => name[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.postHeaderInfo}>
                    <Pressable onPress={() => setSelectedExpert({
                      name: post.expert_name,
                      contact: post.expert_contact,
                      email: post.expert_email,
                      address: post.expert_address,
                      specialization: post.expert_specialization,
                      status: post.status,
                    })}>
                      <Text style={styles.expertName}>{post.expert_name}</Text>
                    </Pressable>
                    <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => handleMenuPress(post._id)}
                  >
                    <MaterialIcons name="more-vert" size={24} color="#65676B" />
                  </TouchableOpacity>
                </View>

                {menuVisible === post._id && (
                  <View style={styles.menuDropdown}>
                    {post.expert_contact === mobile && (
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleDeletePost(post._id)}
                      >
                        <Text style={[styles.menuItemText, { color: '#FF5252' }]}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <View style={styles.postContent}>
                  <View style={styles.plantInfoContainer}>
                    <Text style={styles.plantName}>{post.plant_name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getHealthStatusColor(post.health_status) }]}>
                      <Text style={styles.statusText}>
                        {post.health_status === 'healthy' ? 'Healthy' : 'Infected'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.description}>
                    {post.description || 'No description available.'}
                  </Text>
                  {post.health_status !== 'healthy' && post.solution && (
                    <View style={[styles.solutionContainer, { minHeight: Math.min(100, post.solution.length * 0.5) }]}>
                      <Text style={styles.solutionLabel}>Solution:</Text>
                      <Text style={styles.solutionText}>{post.solution}</Text>
                    </View>
                  )}
                </View>

                {post.images.length > 0 && (
                  <View style={styles.imageContainer}>
                    {post.images.length === 1 ? (
                      <TouchableOpacity onPress={() => handleImagePress(post.images[0])}>
                        <Image source={{ uri: post.images[0] }} style={styles.singleImage} />
                      </TouchableOpacity>
                    ) : (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                        {post.images.map((img, index) => (
                          <TouchableOpacity key={index} onPress={() => handleImagePress(img)}>
                            <Image source={{ uri: img }} style={styles.postImage} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={!!selectedExpert} animationType="slide" transparent={true} onRequestClose={() => setSelectedExpert(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Expert Details</Text>
            {selectedExpert && (
              <View style={styles.expertDetails}>
                <View style={styles.expertAvatarLarge}>
                  <Text style={styles.expertInitialsLarge}>
                    {selectedExpert.name.split(' ').map(name => name[0]).join('')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailText}>{selectedExpert.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="call" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailText}>{selectedExpert.contact}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="email" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailText}>{selectedExpert.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailText}>{selectedExpert.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="eco" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Specialization:</Text>
                  <Text style={styles.detailText}>{selectedExpert.specialization}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="check-box" size={20} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailText}>{selectedExpert.status}</Text>
                </View>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.messageButton} onPress={() => setSelectedExpert(null)}>
                <MaterialIcons name="chat" size={18} color="#fff" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedExpert(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageModalCloseButton} onPress={() => setSelectedImage(null)}>
            <MaterialIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.enlargedImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable style={styles.navButton} onPress={handleHomePress}>
          <MaterialIcons name="home" size={24} color="#4CAF50" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={handlePostsPress}>
          <MaterialIcons name="post-add" size={24} color="#4CAF50" />
          <Text style={styles.navText}>Posts</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  contentContainer: { paddingBottom: 80 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#65676B',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#65676B',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    position: 'relative',
  },
  postHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  expertAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  expertInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postHeaderInfo: { flex: 1 },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1e21',
  },
  timestamp: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 2,
  },
  menuButton: {
    padding: 5,
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  postContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  plantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    color: '#1c1e21',
    lineHeight: 20,
    marginBottom: 8,
  },
  solutionContainer: {
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  solutionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 14,
    color: '#1c1e21',
  },
  imageContainer: { width: '100%' },
  singleImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  postImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4CAF50',
  },
  expertDetails: { alignItems: 'center' },
  expertAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  expertInitialsLarge: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#65676B',
    marginLeft: 8,
    marginRight: 4,
    width: 100,
  },
  detailText: {
    fontSize: 16,
    color: '#1c1e21',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  messageButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  closeButton: {
    backgroundColor: '#E4E6EB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  closeButtonText: {
    color: '#1c1e21',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  enlargedImage: {
    width: '100%',
    height: '100%',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
  },
  navButton: { alignItems: 'center' },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
});

export default PostFarmer;