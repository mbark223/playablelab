import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder as FolderIcon, Upload, Search, Plus, MoreVertical, FileImage, FolderPlus, ArrowLeft, Trash2, Grid, List, FolderInput } from "lucide-react";
import { useAssets } from "@/lib/AssetContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Assets() {
  const { assets, folders, createFolder, deleteFolder, addAsset, removeAsset, moveAssetToFolder } = useAssets();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const currentFolder = folders.find(f => f.id === currentFolderId);
  
  // Filter items
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentAssets = assets.filter(a => a.folderId === (currentFolderId || null)); // Handle undefined vs null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addAsset(Array.from(e.target.files), currentFolderId);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName, currentFolderId);
      setNewFolderName('');
      setIsNewFolderOpen(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             {currentFolderId && (
               <Button variant="ghost" size="icon" onClick={() => setCurrentFolderId(currentFolder?.parentId || null)}>
                 <ArrowLeft className="h-5 w-5" />
               </Button>
             )}
             <div>
               <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                 {currentFolder ? currentFolder.name : "Assets"}
               </h1>
               <p className="text-muted-foreground mt-1">
                 {currentFolderId ? `Manage assets in ${currentFolder?.name}` : "Manage your game assets and marketing kits"}
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center border border-border rounded-md bg-card">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9 rounded-none border-r border-border", viewMode === 'grid' && "bg-muted")}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9 rounded-none", viewMode === 'list' && "bg-muted")}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FolderPlus className="h-4 w-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input 
                    placeholder="Folder Name" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateFolder}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="relative">
               <input 
                 type="file" 
                 id="asset-upload" 
                 multiple 
                 className="hidden"
                 onChange={handleFileUpload}
               />
               <Button asChild className="gap-2 shadow-lg shadow-primary/20">
                 <label htmlFor="asset-upload" className="cursor-pointer">
                   <Upload className="h-4 w-4" />
                   Upload Assets
                 </label>
               </Button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs (Simple) */}
        {currentFolderId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span 
              className="hover:text-primary cursor-pointer"
              onClick={() => setCurrentFolderId(null)}
            >
              Assets
            </span>
            <span>/</span>
            <span className="font-medium text-foreground">{currentFolder?.name}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
           {currentFolders.length === 0 && currentAssets.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/20">
               <FolderIcon className="h-12 w-12 mb-4 opacity-20" />
               <p className="font-medium">This folder is empty</p>
               <p className="text-sm">Upload assets or create a new folder to get started</p>
             </div>
           ) : (
             <div className={cn(
               "grid gap-4",
               viewMode === 'grid' ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"
             )}>
               {/* Folders */}
               {currentFolders.map(folder => (
                 <div 
                   key={folder.id}
                   className={cn(
                     "group relative bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all",
                     viewMode === 'list' && "flex items-center justify-between"
                   )}
                   onClick={() => setCurrentFolderId(folder.id)}
                 >
                   <div className={cn("flex items-center gap-3", viewMode === 'grid' && "flex-col text-center")}>
                     <FolderIcon className={cn(
                       "text-yellow-500 fill-yellow-500/20",
                       viewMode === 'grid' ? "h-16 w-16" : "h-10 w-10"
                     )} />
                     <div className="min-w-0">
                       <p className="font-medium truncate max-w-full">{folder.name}</p>
                       <p className="text-xs text-muted-foreground">{folders.filter(f => f.parentId === folder.id).length} folders</p>
                     </div>
                   </div>
                   
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className={cn("opacity-0 group-hover:opacity-100 transition-opacity", viewMode === 'grid' && "absolute top-2 right-2")}>
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                       <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}>
                         <Trash2 className="h-4 w-4 mr-2" /> Delete
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </div>
               ))}

               {/* Assets */}
               {currentAssets.map(asset => (
                 <div 
                   key={asset.id}
                   className={cn(
                     "group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all",
                     viewMode === 'list' && "flex items-center p-2 gap-4"
                   )}
                 >
                   <div className={cn("relative bg-muted/50", viewMode === 'grid' ? "aspect-square" : "h-16 w-16 rounded-md")}>
                     <img src={asset.previewUrl} className="w-full h-full object-contain p-2" />
                   </div>
                   
                   <div className={cn("p-3", viewMode === 'list' && "flex-1 p-0 flex items-center justify-between")}>
                     <div className="min-w-0">
                       <p className="font-medium truncate text-sm">{asset.name}</p>
                       <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                     </div>

                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className={cn("opacity-0 group-hover:opacity-100 transition-opacity", viewMode === 'grid' && "absolute top-2 right-2")}>
                           <MoreVertical className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <FolderInput className="h-4 w-4 mr-2" /> Move to...
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem 
                                disabled={currentFolderId === null}
                                onClick={() => moveAssetToFolder(asset.id, null)}
                              >
                                <FolderIcon className="h-4 w-4 mr-2" /> Assets Root
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {folders
                                .filter(f => f.id !== currentFolderId) // Don't show current folder
                                .map(folder => (
                                <DropdownMenuItem 
                                  key={folder.id}
                                  onClick={() => moveAssetToFolder(asset.id, folder.id)}
                                >
                                  <FolderIcon className="h-4 w-4 mr-2" /> {folder.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem className="text-destructive" onClick={() => removeAsset(asset.id)}>
                           <Trash2 className="h-4 w-4 mr-2" /> Delete
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </Layout>
  );
}
