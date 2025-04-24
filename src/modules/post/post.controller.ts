import { NextFunction, Request, Response } from "express";
import PostService from "./post.service";
import CreatePostDto from "./dtos/create_post.dto";
import { IPost } from "./post.interface";
import CreateCommentDto from "./dtos/create_comment.dto";

export default class PostController {
  private postService = new PostService();

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const userId = req.user.id;
      const newPost: IPost = await this.postService.createPost(userId, model);
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const model: CreatePostDto = req.body;
      const updatePost = await this.postService.updatePost(postId, model);
      res.status(200).json(updatePost);
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const post = await this.postService.getPostById(postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public getPostPagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const keyword = req.query.keyword as string;
      const page: number = Number(req.query.page) || 1;
      const user = await this.postService.getAllPaging(keyword, page);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const result = await this.postService.deletePost(userId,postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const result = await this.postService.likePost(userId,postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unLikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const result = await this.postService.unLikePost(userId,postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const comment: CreateCommentDto = req.body
      const result = await this.postService.addComment(userId,postId,comment);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const commentID = req.params.cmtId
      const result = await this.postService.removeComment(userId,postId,commentID);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public sharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const result = await this.postService.sharePost(userId,postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unSharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      const result = await this.postService.unSharePost(userId,postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
