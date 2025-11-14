
# Feature Request: Media Sharing in Messaging System

## Overview
Add the ability for users to send pictures and videos within the Smart Fundi messaging system to make communication more effective. Users should be able to capture photos/videos directly from their phone camera or select existing files from their device gallery.

## User Stories

### As a Customer:
- I want to send photos of broken appliances/equipment so the fundi can understand the problem before arriving
- I want to send videos showing the issue (e.g., strange noise, leak, malfunction) for better diagnosis
- I want to share photos of parts I need so shops can confirm availability

### As a Fundi:
- I want to send photos of completed work to customers for verification
- I want to send pictures of required parts/tools to customers before purchase
- I want to share videos demonstrating repair techniques or explaining issues

### As a Shop Owner:
- I want to send photos of available parts/products to customers
- I want to share videos showing product features or installation instructions
- I want to send photos of my storefront or inventory to build trust

## Technical Requirements

### 1. Media Upload Interface (ChatInterface.tsx)

**Input Options:**
- Camera button (📷) to capture new photo/video
- Gallery button (🖼️) to select existing media
- Both buttons should be next to the text input field
- Support for both mobile camera access and file picker

**File Type Support:**
- Images: JPEG, PNG, WebP, HEIC
- Videos: MP4, MOV, WebM
- Max file size: 10MB for images, 50MB for videos

**Upload Flow:**
1. User clicks camera/gallery button
2. File picker opens (with camera access on mobile)
3. User selects/captures media
4. Show preview thumbnail with "Send" and "Cancel" options
5. Show upload progress indicator
6. After upload, media appears in chat as a message

### 2. Media Storage

**Cloud Storage Structure:**
```
/messages/
  /{conversationId}/
    /{messageId}/
      /image_{timestamp}.jpg
      /video_{timestamp}.mp4
```

**Storage Rules:**
- User-scoped access (only conversation participants can access)
- Automatic compression for large images (resize to max 1200px width)
- Video transcoding for compatibility (optional, can be phase 2)
- Generate thumbnails for videos
- Implement cleanup for deleted conversations

### 3. Message Data Model Updates

**Update Message interface in src/types/index.ts:**
```typescript
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  mediaType?: "image" | "video" | null;
  mediaUrl?: string;
  mediaThumbnailUrl?: string; // For video thumbnails
  mediaMetadata?: {
    width?: number;
    height?: number;
    duration?: number; // For videos in seconds
    fileSize?: number;
    fileName?: string;
  };
}
```

### 4. Chat Display Enhancements

**Media Message Rendering:**
- Images: Display inline with max-width 300px, clickable to open full-size in modal/lightbox
- Videos: Show thumbnail with play button overlay, open in video player modal
- Show file name and size below media
- Loading state: Show skeleton/spinner while media uploads
- Error state: Show retry button if upload fails
- Failed uploads: Allow retry or delete

**Lightbox/Modal Features:**
- Full-screen media viewer
- Pinch-to-zoom for images (mobile)
- Video controls (play, pause, seek, volume)
- Download button
- Close button

### 5. Mobile Optimization

**Camera Access (PWA):**
```typescript
// Use HTML5 media capture
<input 
  type="file" 
  accept="image/*,video/*" 
  capture="environment" // Back camera
  onChange={handleMediaCapture}
/>
```

**Permissions:**
- Request camera permission on first use
- Handle permission denied gracefully
- Show fallback to file picker if camera unavailable

**Compression:**
- Client-side image compression before upload (using canvas API)
- Show compression progress
- Maintain aspect ratio

### 6. Performance Considerations

**Lazy Loading:**
- Load media thumbnails first
- Load full-resolution on click/view
- Implement virtual scrolling for long conversations with many media

**Caching:**
- Cache downloaded media in browser storage
- Clear cache on logout or after 7 days

**Bandwidth:**
- Show file size before upload
- Warn user if on cellular data and file >5MB
- Option to send compressed version

### 7. UI/UX Specifications

**Message Input Area:**
```
+------------------------------------------+
| [📷 Camera] [🖼️ Gallery]  [Text input...] [Send] |
+------------------------------------------+
```

**Media Preview Before Send:**
```
+---------------------------+
|   [Preview Thumbnail]     |
|   filename.jpg (2.3 MB)   |
|   [Cancel]    [Send] ✓    |
+---------------------------+
```

**Media Message Bubble:**
```
+---------------------------+
| [Image/Video Thumbnail]   |
|  "Here's the broken part" |
|  10:45 AM                 |
+---------------------------+
```

### 8. Security & Privacy

**Access Control:**
- Only conversation participants can view media
- Secure Cloud Storage URLs with authentication
- No direct public URLs

**Content Moderation (Optional Future):**
- Flag inappropriate content
- Report button for media messages
- Admin review queue for reported media

**Data Retention:**
- Keep media for 90 days after conversation ends
- Allow users to download their media before deletion
- Option to manually delete sent media

### 9. Error Handling

**Upload Errors:**
- Network failure: Show retry button
- File too large: Show size limit message
- Unsupported format: List supported formats
- Storage quota exceeded: Notify admin

**Display Errors:**
- Failed to load: Show placeholder with retry
- Corrupt file: Show error message
- Missing media: "Media no longer available"

### 10. Accessibility

- Alt text for images (optional user input)
- Screen reader announcements for media messages
- Keyboard navigation for lightbox/modal
- High contrast mode support

## Implementation Phases

### Phase 1 (MVP):
- Image upload from gallery
- Image display in chat
- Basic lightbox viewer
- Cloud Storage integration
- Message model updates

### Phase 2:
- Camera capture
- Video support
- Compression
- Thumbnails
- Progress indicators

### Phase 3:
- Advanced features (zoom, download)
- Performance optimizations
- Content moderation
- Analytics

## Testing Requirements

1. **Cross-browser Testing:**
   - Chrome, Safari, Firefox (mobile and desktop)
   - iOS Safari, Android Chrome

2. **Performance Testing:**
   - Upload speeds on 3G/4G/WiFi
   - Memory usage with multiple media messages
   - Battery impact on mobile

3. **User Testing:**
   - Can users easily find the camera/gallery buttons?
   - Is the upload process clear and intuitive?
   - Do media messages display correctly?

## Success Metrics

- Media upload success rate >95%
- Average upload time <10 seconds (3G)
- User engagement: 30%+ of messages include media
- Customer satisfaction: Reduced need for in-person visits to explain issues

## Related Files to Modify

1. **src/components/messaging/ChatInterface.tsx** - Add media upload UI
2. **src/components/messaging/ConversationList.tsx** - Show media preview in conversation list
3. **src/types/index.ts** - Update Message interface
4. **src/lib/mockData.ts** - Add mock messages with media (for testing)
5. **src/pages/messages.tsx** - Ensure proper integration

## Mock Data Example

Add sample media messages for testing:
```typescript
{
  id: "msg-media-1",
  conversationId: "conv-1",
  senderId: "customer-1",
  senderName: "John Doe",
  text: "This is the broken water pump",
  timestamp: "2025-01-14T10:30:00Z",
  mediaType: "image",
  mediaUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
  mediaMetadata: {
    width: 800,
    height: 600,
    fileSize: 245000,
    fileName: "water_pump.jpg"
  }
}
```

## Additional Considerations

**Localization:**
- All UI text in English and Swahili
- "Send Photo" → "Tuma Picha"
- "Send Video" → "Tuma Video"
- "Camera" → "Kamera"
- "Gallery" → "Picha"

**Cost Considerations:**
- Estimate Cloud Storage costs for media hosting
- Implement storage quotas per user/conversation
- Consider CDN for faster media delivery

**Future Enhancements:**
- Voice messages
- Document sharing (PDFs, receipts)
- Location sharing
- Screenshot annotation tools
</feature_request>
