import userModel from "../user/user.model";
import CreatePostDto from "./dtos/create_post.dto";
import { IComment, ILike, IPost, IShare } from "./post.interface";
import HttpException from "../../core/exceptions/http.exception";
import postModel from "./post.model";
import { IPagination } from "core/interface";
import CreateCommentDto from "./dtos/create_comment.dto";
import { text } from "express";

export default class PostService {
  public async createPost(
    userId: string,
    postDto: CreatePostDto
  ): Promise<IPost> {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const newPost = await postModel.create({
      text: postDto.text,
      name: user.first_name + " " + user.last_name,
      user: userId,
      avatar: user.avatar,
    });

    return newPost;
  }

  public async updatePost(
    postId: string,
    postDto: CreatePostDto
  ): Promise<IPost> {
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { ...postDto },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Post is not found");
    }

    return updatedPost;
  }

  public async getAllPost(): Promise<IPost[]> {
    const posts = await postModel.find().sort({ date: -1 });

    return posts;
  }

  public async getPostById(postId: string): Promise<IPost> {
    const post = await postModel.findById(postId);

    if (!post) {
      throw new HttpException(400, "not found");
    }

    return post;
  }

  public async getAllPaging(
    keyword: string,
    page: number
  ): Promise<IPagination<IPost>> {
    const pageSize = Number(process.env.PAGE_SIZE || 10);

    let query = {};
    if (keyword) {
      query = { email: { $regex: keyword, $options: "i" } };
    }

    const posts = await postModel
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const countPost = await postModel.find(query).countDocuments();

    return {
      total: countPost,
      page: page,
      pageSize: pageSize,
      items: posts,
    } as IPagination<IPost>;
  }

  public async deletePost(userId: string, postId: string) {
    const result = await postModel.deleteOne({ user: userId, _id: postId });

    if (!result) {
      throw new HttpException(400, "delete fail");
    }

    return result;
  }

  public async likePost(userId: string, postId: string): Promise<ILike> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const isAlreadyLiked = post.likes.some(
      (like) => like.user.toString() === userId
    );
    if (isAlreadyLiked) {
      throw new HttpException(400, "Post already liked");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $push: { likes: { user: userId } } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to like the post");
    }

    return updatedPost;
  }

  public async unLikePost(userId: string, postId: string): Promise<ILike> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const isAlreadyLiked = post.likes.some(
      (like) => like.user.toString() === userId
    );
    if (!isAlreadyLiked) {
      throw new HttpException(400, "Post has not liked");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: { user: userId } } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to unlike the post");
    }

    return updatedPost;
  }

  public async addComment(
    userId: string,
    postId: string,
    comment: CreateCommentDto
  ): Promise<IComment[]> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new HttpException(400, "User not found");
    }
    const newComment = {
      text: comment.text,
      name: user.first_name + " " + user.last_name,
      avatar: user.avatar,
      user: user.id,
    };

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to comment the post");
    }

    return updatedPost.comments;
  }

  public async removeComment(
    userId: string,
    postId: string,
    commentId: string
  ): Promise<IComment[]> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: { user: userId, _id: commentId } } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to remove comment the post");
    }

    return updatedPost.comments;
  }

  public async sharePost(userId: string, postId: string): Promise<IShare> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const isAlreadyShare = post.shares.some(
      (share) => share.user.toString() === userId
    );
    if (isAlreadyShare) {
      throw new HttpException(400, "Post already share");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $push: { shares: { user: userId } } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to like the post");
    }

    return updatedPost;
  }

  public async unSharePost(userId: string, postId: string): Promise<IShare> {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new HttpException(400, "post not found");
    }

    const isAlreadyShare = post.shares.some(
      (share) => share.user.toString() === userId
    );
    if (!isAlreadyShare) {
      throw new HttpException(400, "Post has not share");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { shares: { user: userId } } },
      { new: true }
    );

    if (!updatedPost) {
      throw new HttpException(400, "Failed to unlike the post");
    }

    return updatedPost;
  }
}
