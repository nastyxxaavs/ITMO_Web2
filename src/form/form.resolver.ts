import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Submission } from './dto/form_gql.output';
import { PaginatedForms } from './dto/paginated-form_gql.output';
import { UpdateFirmInput } from '../firm/dto/update-firm_gql.input';
import { CreateSubmissionInput } from './dto/create-form_gql.input';
import { UseGuards } from '@nestjs/common';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';


@Resolver(() => Submission)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => PaginatedForms, { name: 'getForms' })
  async getForms(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<[Submission[], number]> {
    return this.formService.findAllWithPagination(page, limit);
  }

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => Submission, { name: 'getForm' })
  async getForm(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Submission> {
    const form = await this.formService.findOne(id);
    if (!form) {
      throw new Error(`Form with ID ${id} not found`);
    }
    return form;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Submission)
  async createForm(
    @Args('createSubmissionInput') createSubmissionInput: CreateSubmissionInput,
  ): Promise<Submission> {
    return this.formService.create(createSubmissionInput);
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Submission)
  async updateForm(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateSubmissionInput') updateSubmissionInput: UpdateFirmInput,
  ): Promise<Submission> {
    const updatedForm = await this.formService.apiUpdate(
      id,
      updateSubmissionInput,
    );
    if (!updatedForm) {
      throw new Error(`Form with ID ${id} not found`);
    }
    return updatedForm;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Boolean)
  async removeForm(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removed = await this.formService.remove(id);
    if (!removed) {
      throw new Error(`Form with ID ${id} not found`);
    }
    return true;
  }
}
